import type { Request, Response } from "express";
import { getDatabase } from "@repo/database";
import * as v from "valibot";
import { getGenerationModelFactory } from "@repo/langchain";
import { RequestBodyOf, ResponseBodyOf } from "@repo/api-types/utility/reducer";
import { ChatSessions } from "@repo/api-types/route/chat";

type ReqBodyDefinition = RequestBodyOf<ChatSessions, "POST">;
type ResBodyDefinition = ResponseBodyOf<ChatSessions, "POST">;

const BodySchemaPromise = async () => {
  return v.objectAsync({
    name: v.string(),
    generationModelName: v.picklistAsync(
      (await getGenerationModelFactory()).getModelsName(),
      "Invalid model name",
    ),
  });
};

export async function createChatSession_cb(
  req: Request,
  res: Response<ResBodyDefinition>,
): Promise<Response<ResBodyDefinition>> {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, error: "Unauthorized" });
    const user = req.user;
    //
    const db = await getDatabase();

    const result = await v.safeParseAsync(await BodySchemaPromise(), req.body);
    if (!result.success) {
      console.log(result.issues);
      return res.status(400).json({
        success: false,
        error: "Invalid body parameters",
      });
    }

    const { name, generationModelName } =
      result.output satisfies ReqBodyDefinition;

    const ModelFactory = await getGenerationModelFactory();

    if (!ModelFactory.hasModel(generationModelName)) {
      return res.status(400).json({
        success: false,
        error: "Invalid generation model name",
      });
    }

    const chatNameExists = await db.chat.session.chatSessionExists(
      user.userId,
      name,
    );
    if (chatNameExists) {
      return res.status(400).json({
        success: false,
        error: "Chat name already exists",
      });
    }

    const chatSession = await db.chat.chat.createChat(
      user.userId,
      name,
      generationModelName,
    );

    return res.status(200).json({ success: true, chatSession });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}
