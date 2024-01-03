import { RequestDefinition, ResponseDefinition } from "../types";

type Request = RequestDefinition<"GET">;
type Response = ResponseDefinition<{
  message: string;
}>;

export type RouteDefinition = {
  path: "/";
  request: Request;
  response: Response;
};
