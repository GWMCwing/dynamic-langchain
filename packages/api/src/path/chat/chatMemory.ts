import { ChatSchema_Chat_Action } from "@repo/database/prisma/action.js";
import {
  GetRequestDefinition,
  HeaderWithAuth,
  ResponseDefinition,
} from "../../utility/request.js";
import { InterfaceDefinition, RouteDefinition } from "../../utility/route.js";

type GET_ChatMemory = InterfaceDefinition<
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
          ChatSchema_Chat_Action["getChatMemory"]["Returns"]
        >;
      },
    "json"
  >
>;

export type ChatMemory = RouteDefinition<
  `/chatMemory/${string}`,
  {
    GET: GET_ChatMemory;
  }
>;
