import {
  ResponseDefinition,
  HeaderWithAuth,
  GetRequestDefinition,
} from "../../utility/request.js";
import type { ChatSession as ChatSession_DB } from "@repo/database/prisma/client.js";
import type { ChatSchema_Session_Action } from "@repo/database/prisma/action.js";
import { InterfaceDefinition, RouteDefinition } from "../../utility/route.js";

type GET_SessionList = InterfaceDefinition<
  "GET",
  GetRequestDefinition<HeaderWithAuth>,
  ResponseDefinition<
    | {
        success: false;
        error: string;
      }
    | {
        success: true;
        chatSessionList: Awaited<
          ChatSchema_Session_Action["getChatSessionList"]["Returns"]
        >;
      }
  >
>;

type GET_Session = InterfaceDefinition<
  "GET",
  GetRequestDefinition<HeaderWithAuth>,
  ResponseDefinition<
    | {
        success: false;
        error: string;
      }
    | {
        success: true;
        chatSession: Awaited<
          ChatSchema_Session_Action["getChatSession"]["Returns"]
        >;
      }
  >
>;

export type ChatSessionList = RouteDefinition<
  "/chat/chatSessions",
  { GET: GET_SessionList }
>;

export type ChatSession = RouteDefinition<
  `/chat/chatSessions/${string}`,
  { GET: GET_Session }
>;
