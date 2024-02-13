import { ChatSchema_Chat } from "../database/chat/chat.js";
import { ChatSchema_Session } from "../database/chat/session.js";
import { MethodReturnTypes } from "./helper.js";

export type ChatSchema_Session_Action = MethodReturnTypes<ChatSchema_Session>;
export type ChatSchema_Chat_Action = MethodReturnTypes<ChatSchema_Chat>;
