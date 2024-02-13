import type { Request, Response } from "express";
import { getDatabase } from "@repo/database";
import { OptionalIntStringSchema } from "../utility/valibot.js";

import * as v from "valibot";

const QuerySchema = v.object({
  offset: OptionalIntStringSchema,
  limit: OptionalIntStringSchema,
});

export async function getChatMemory_cb(req: Request, res: Response) {
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
  let { offset_query, limit_query } = req.query;
  const result = v.safeParse(QuerySchema, {
    offset: offset_query,
    limit: limit_query,
  });

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid query parameters",
    });
  }

  const { offset, limit } = result.output;

  const db = await getDatabase();
  const chatSession = await db.chat.chat.getChatMemory(
    user.userId,
    chatSessionId,
    offset,
    limit,
  );
  res.status(200).json({ success: true, chatSession });
}
