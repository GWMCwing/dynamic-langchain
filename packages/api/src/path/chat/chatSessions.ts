import {
  ResponseDefinition,
  HeaderWithAuth,
  GetRequestDefinition,
  PostRequestDefinition,
} from "../../utility/request.js";
import type {
  ChatSchema_Chat_Action,
  ChatSchema_Session_Action,
} from "@repo/database/prisma/action.js";
import { InterfaceDefinition, RouteDefinition } from "../../utility/route.js";
import { AllowedModelName_GenerationModel } from "@repo/langchain/typing";

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

type POST_CreateSession = InterfaceDefinition<
  "POST",
  PostRequestDefinition<
    HeaderWithAuth,
    {
      name: string;
      generationModelName: AllowedModelName_GenerationModel;
    }
  >,
  ResponseDefinition<
    | {
        success: false;
        error: string;
      }
    | {
        success: true;
        chatSession: Awaited<ChatSchema_Chat_Action["createChat"]["Returns"]>;
      }
  >
>;

export type ChatSessionList = RouteDefinition<
  "/chat/chatSessions",
  { GET: GET_SessionList }
>;

export type CreateChatSession = RouteDefinition<
  "/chat/chatSessions",
  { POST: POST_CreateSession }
>;

export type ChatSession = RouteDefinition<
  `/chat/chatSessions/${string}`,
  { GET: GET_Session }
>;
