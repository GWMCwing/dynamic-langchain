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
      username: string;
      password: string;
    }
  >,
  ResponseDefinition<
    | {
        success: false;
        error: string;
      }
    | {
        success: true;
      },
    "json"
  >
>;

export type Register = RouteDefinition<"/auth/register", { POST: POST }>;
