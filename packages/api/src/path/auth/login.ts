import { UserJWTData } from "../../data/UserJWT.js";
import {
  PostRequestDefinition,
  ResponseDefinition,
} from "../../utility/request.js";
import { RouteDefinition, InterfaceDefinition } from "../../utility/route.js";

type POST = InterfaceDefinition<
  "POST",
  PostRequestDefinition<
    {},
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
        userData: UserJWTData;
        token: string;
      }
  >
>;

export type Login = RouteDefinition<"/auth/login", { POST: POST }>;
