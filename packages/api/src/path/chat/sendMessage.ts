import {
  HeaderWithAuth,
  PostRequestDefinition,
  ResponseDefinition,
} from "../../utility/request.js";
import { InterfaceDefinition, RouteDefinition } from "../../utility/route.js";

type POST_ChatMessage = InterfaceDefinition<
  "POST",
  PostRequestDefinition<
    HeaderWithAuth,
    {
      sessionId: string;
      systemMessage: string;
      text: string;
    }
  >,
  ResponseDefinition<
    | {
        success: false;
        error: string;
      }
    | {
        success: true;
        data: {
          text: string;
        };
      }
  >
>;

export type ChatMessage = RouteDefinition<
  `/sendMessage`,
  {
    POST: POST_ChatMessage;
  }
>;
