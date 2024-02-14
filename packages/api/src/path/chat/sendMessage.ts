import {
  HeaderWithAuth,
  PostRequestDefinition,
  ResponseDefinition,
} from "../../utility/request.js";
import { InterfaceDefinition, RouteDefinition } from "../../utility/route.js";

type RequestBody = {
  sessionId: string;
  systemMessage: string;
  text: string;
};

type POST_ChatMessage = InterfaceDefinition<
  "POST",
  PostRequestDefinition<HeaderWithAuth, RequestBody>,
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
      },
    "json"
  >
>;

type POST_ChatMessageStream = InterfaceDefinition<
  "POST",
  PostRequestDefinition<HeaderWithAuth, RequestBody>,
  ResponseDefinition<
    ReadableStream<string> | { success: false; error: string },
    "stream"
  >
>;

export type ChatMessage = RouteDefinition<
  `/sendMessage`,
  {
    POST: POST_ChatMessage;
  }
>;
