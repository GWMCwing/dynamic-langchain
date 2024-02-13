import type { Request, Response } from "express";
import { getUser } from "../utility/request.js";
import { getDatabase } from "@repo/database";
import type { ChatSessionList } from "@repo/api-types/route/chat";
import { RequestBodyOf, ResponseBodyOf } from "@repo/api-types/utility";

type ReqBodyDefinition = RequestBodyOf<ChatSessionList, "GET">;
type ResBodyDefinition = ResponseBodyOf<ChatSessionList, "GET">;

export async function getChatSessionList_cb(
  req: Request,
  res: Response<ResBodyDefinition>,
): Promise<Response<ResBodyDefinition>> {
  try {
    const user = getUser(req, res);
    if (!user)
      return res.status(400).json({ success: false, error: "Invalid user" });
    const db = await getDatabase();
    const chatSessionList = await db.chat.session.getChatSessionList(
      user.userId,
    );
    return res.status(200).json({ success: true, chatSessionList });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}
