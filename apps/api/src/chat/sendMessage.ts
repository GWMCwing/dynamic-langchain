import type { Request, Response } from "express";
import { getUser } from "../utility/request";
import { getDatabase } from "database";
import * as v from "valibot";
import { ModelHandlerFactory, type AllowedModelName } from "langchain_local";
import type { RunnableLike } from "@langchain/core/runnables";
import { RunnableSequence, StringOutputParser } from "langchain_local";

const BodySchema = v.object({
  sessionId: v.string(),
  systemMessage: v.string(),
  text: v.string(),
});

export async function sendMessage_cb(req: Request, res: Response) {
  const user = getUser(req, res);
  if (!user) return;
  const { chatSessionId } = req.params;
  const result = v.safeParse(BodySchema, req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid body parameters",
    });
  }
  const { sessionId, text, systemMessage } = result.output;
  //
  try {
    const db = await getDatabase();
    const sessionConfig = await db.chat.config.getChatSessionConfig(
      user.userId,
      sessionId,
    );
    //
    if (!sessionConfig) {
      return res.status(400).json({
        success: false,
        error: "Invalid session id",
      });
    }
    //
    const generationModelInfo = await db.langChain.model.getGenerationModel(
      sessionConfig.generationModelId,
    );
    //
    if (!generationModelInfo) {
      return res.status(400).json({
        success: false,
        error: "Generation model not found",
      });
    }
    if (!generationModelInfo.active) {
      return res.status(400).json({
        success: false,
        error: "Generation model is not active",
      });
    }
    //
    //
    using generationModelHandlerResource =
      ModelHandlerFactory.getModelHandlerFactoryResource(
        generationModelInfo.name as AllowedModelName,
      );
    const generationModelHandler = generationModelHandlerResource.resource;
    //
    //
    const promptTemplateHandler = generationModelHandler.getTemplateHandler();
    const template = promptTemplateHandler.buildTemplate();
    //
    const runnableSequence: RunnableLike[] = [];
    //

    try {
      // TODO: auto load model
      const model = generationModelHandler.getModelRunnable();
      runnableSequence.push(template);
      runnableSequence.push(model);
      runnableSequence.push(new StringOutputParser());
      //
      const result = await RunnableSequence.from(
        runnableSequence as any,
      ).invoke({
        prompt: text,
        context: "",
        system_message: systemMessage,
      });
      console.log(result);
      //
      return res.status(200).json({
        success: true,
        data: {
          text: result,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        error: "Generation model is not active",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}