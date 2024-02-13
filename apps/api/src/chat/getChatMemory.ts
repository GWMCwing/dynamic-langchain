import type { Request, Response } from "express";
import { getDatabase } from "@repo/database";
import { OptionalIntStringSchema } from "../utility/valibot.js";
import {
  QueryOf,
  RequestBodyOf,
  ResponseBodyOf,
} from "@repo/api-types/utility/reducer";

import * as v from "valibot";
import { ChatMemory } from "@repo/api-types/route/chat";

type ReqBodyDefinition = RequestBodyOf<ChatMemory, "GET">;
type ResBodyDefinition = ResponseBodyOf<ChatMemory, "GET">;
type ReqQueryDefinition = QueryOf<ChatMemory, "GET">;

const QuerySchema = v.object({
  offset: OptionalIntStringSchema,
  limit: OptionalIntStringSchema,
});

export async function getChatMemory_cb(
  req: Request,
  res: Response<ResBodyDefinition>,
): Promise<Response<ResBodyDefinition>> {
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

    const { offset, limit } = result.output satisfies ReqQueryDefinition;

    const db = await getDatabase();
    const chatSession = await db.chat.chat.getChatMemory(
      user.userId,
      chatSessionId,
      offset,
      limit,
    );
    return res.status(200).json({ success: true, chatSession });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
}
