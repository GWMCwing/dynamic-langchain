import type {
  BaseRequestDefinition,
  RequestMethod,
  ResponseDefinition,
} from "./request.js";

export type RoutePath = `/${string}`;

export type RouteDefinition<
  Request extends BaseRequestDefinition<RequestMethod>,
  Response extends ResponseDefinition,
> = {
  path: RoutePath;
  request: Request;
  response: Response;
};
