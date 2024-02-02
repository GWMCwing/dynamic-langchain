import { Router } from "express";
import { getChatSessionList_cb, getChatSession_cb } from "./getChatSession";
import { requireLogin_Middleware } from "../middleware/user";
import { getChatMemory_cb } from "./getChatMemory";
import { sendMessage_cb } from "./sendMessage";
import { createChatSession_cb } from "./createChatSession";

const router = Router();

router.get("/chatSessions", requireLogin_Middleware, getChatSessionList_cb);
router.get(
  "/chatSessions/:chatSessionId",
  requireLogin_Middleware,
  getChatSession_cb,
);

router.get(
  "/chatMemory/:chatSessionId",
  requireLogin_Middleware,
  getChatMemory_cb,
);

router.post("/sendMessage", requireLogin_Middleware, sendMessage_cb);
router.post(
  "/createChatSession",
  requireLogin_Middleware,
  createChatSession_cb,
);

export { router as chatRouter };
