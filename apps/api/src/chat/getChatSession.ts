import type { Request, Response } from "express";
import { getUser } from "../utility/request";
import { getDatabase } from "@repo/database";

export async function getChatSessionList_cb(req: Request, res: Response) {
  const user = getUser(req, res);
  if (!user) return;
  const db = await getDatabase();
  const chatSessionList = await db.chat.session.getChatSessionList(user.userId);
  res.status(200).json({ success: true, chatSessionList });
}

export async function getChatSession_cb(req: Request, res: Response) {
  const user = getUser(req, res);
  if (!user) return;
  const { chatSessionId } = req.params;
  if(chatSessionId === undefined) {
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
  res.status(200).json({ success: true, chatSession });
}
