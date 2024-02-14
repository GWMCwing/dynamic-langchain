import {
  EmptyHeader,
  PostRequestDefinition,
  ResponseDefinition,
} from "../../utility/request.js";
import { RouteDefinition, InterfaceDefinition } from "../../utility/route.js";

type POST = InterfaceDefinition<
  "POST",
  PostRequestDefinition<
    EmptyHeader,
    {
      userId: string;
      sessionId: string;
    }
  >,
  ResponseDefinition<
    | {
        success: false;
        error: string;
      }
    | {
        success: true;
        valid: boolean;
      },
    "json"
  >
>;

export type Validate = RouteDefinition<"/auth/validate", { POST: POST }>;
