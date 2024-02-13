import type { Request, Response } from "express";
import { getDatabase } from "@repo/database";
import * as v from "valibot";
import type { RunnableLike } from "@langchain/core/runnables";
import type { AllowedModelName } from "@repo/langchain";

import {
  ModelHandlerFactory,
  RunnableSequence,
  StringOutputParser,
} from "@repo/langchain";
import { ChatMessage } from "@repo/api-types/route/chat";
import { RequestBodyOf, ResponseBodyOf } from "@repo/api-types/utility/reducer";

type ReqBodyDefinition = RequestBodyOf<ChatMessage, "POST">;
type ResBodyDefinition = ResponseBodyOf<ChatMessage, "POST">;

const BodySchema = v.object({
  sessionId: v.string(),
  systemMessage: v.string(),
  text: v.string(),
});

export async function sendMessage_cb(
  req: Request,
  res: Response<ResBodyDefinition>,
): Promise<Response<ResBodyDefinition>> {
  // TODO: add message to memory after generation
  try {
    if (!req.user)
      return res.status(401).json({ success: false, error: "Unauthorized" });
    const user = req.user;
    //
    const { chatSessionId } = req.params;
    if (chatSessionId === undefined) {
      return res.status(400).json({
        success: false,
        error: "Invalid chat session id",
      });
    }
    //
    const result = v.safeParse(BodySchema, req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid body parameters",
      });
    }
    const { sessionId, text, systemMessage } =
      result.output satisfies ReqBodyDefinition;
    //
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
    //
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
    // TODO: auto load model
    const model = generationModelHandler.getModelRunnable();
    runnableSequence.push(template);
    runnableSequence.push(model);
    runnableSequence.push(new StringOutputParser());
    //
    const runnableResult = await RunnableSequence.from(
      runnableSequence as any,
    ).invoke({
      prompt: text,
      context: "",
      system_message: systemMessage,
    });
    //
    console.log(runnableResult);
    //
    return res.status(200).json({
      success: true,
      data: {
        text: runnableResult,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
}
