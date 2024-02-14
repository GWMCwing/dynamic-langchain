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
import { RequestBodyOf, ResponseBodyOf } from "../../utility/reducer.js";

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
        chatSessionList: {
          id: string;
          modelName: string;
          date: number;
          title: string;
          lastMessage: string;
        }[];
      },
    "json"
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
      },
    "json"
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
      },
    "json"
  >
>;

export type ChatSessions = RouteDefinition<
  "/chat/chatSessions",
  { GET: GET_SessionList; POST: POST_CreateSession }
>;

type R = ResponseBodyOf<ChatSessions, "POST">;

export type ChatSession = RouteDefinition<
  `/chat/chatSessions/${string}`,
  { GET: GET_Session }
>;
