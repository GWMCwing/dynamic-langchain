import type { Request, Response } from "express";
import { getUser } from "../utility/request";
import { getDatabase } from "database";
import * as v from "valibot";
import { getGenerationModelFactory } from "langchain_local";

const BodySchema = v.objectAsync({
  name: v.string(),
  generationModelName: v.picklistAsync(
    (await getGenerationModelFactory()).getModelsName(),
    "Invalid model name",
  ),
});

export async function createChatSession_cb(req: Request, res: Response) {
  const user = getUser(req, res);
  if (!user) return;
  //
  const db = await getDatabase();

  const result = await v.safeParseAsync(BodySchema, req.body);
  if (!result.success) {
    console.log(result.issues);
    return res.status(400).json({
      success: false,
      error: "Invalid body parameters",
    });
  }

  const { name, generationModelName } = result.output;
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
}
