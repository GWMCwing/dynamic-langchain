import type { Request, Response } from "express";
import { getDatabase } from "@repo/database";
import type { ChatSession } from "@repo/api-types/route/chat";
import { RequestBodyOf, ResponseBodyOf } from "@repo/api-types/utility";

type ReqBodyDefinition = RequestBodyOf<ChatSession, "GET">;
type ResBodyDefinition = ResponseBodyOf<ChatSession, "GET">;

export async function getChatSession_cb(
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
    const db = await getDatabase();
    const chatSession = await db.chat.session.getChatSession(
      user.userId,
      chatSessionId,
      0,
      10,
    );
    return res.status(200).json({ success: true, chatSession });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}
