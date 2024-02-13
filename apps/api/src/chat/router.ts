import { Router } from "express";
import { getChatSession_cb } from "./getChatSession.js";
import { requireLogin_Middleware } from "../middleware/user.js";
import { getChatMemory_cb } from "./getChatMemory.js";
import { sendMessage_cb } from "./sendMessage.js";
import { createChatSession_cb } from "./createChatSession.js";
import { getChatSessionList_cb } from "./getChatSessionList.js";

const router: Router = Router();

router.get("/chatSessions", requireLogin_Middleware, getChatSessionList_cb);
router.post("/chatSessions", requireLogin_Middleware, createChatSession_cb);

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

export { router as chatRouter };
