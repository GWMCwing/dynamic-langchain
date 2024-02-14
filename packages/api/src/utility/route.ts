import { ResponseType } from "axios";
import type {
  BaseRequestDefinition,
  RequestMethod,
  ResponseDefinition,
} from "./request.js";

export type RoutePath = `/${string}`;

export type InterfaceDefinition<
  _RequestMethod extends RequestMethod,
  Request extends BaseRequestDefinition<_RequestMethod>,
  Response extends ResponseDefinition<
    string | Record<string, any>,
    ResponseType
  >,
> = {
  request: Request;
  response: Response;
};

export type RouteInterfaceDefinition = {
  [key in RequestMethod]?: InterfaceDefinition<
    key,
    BaseRequestDefinition<key>,
    ResponseDefinition<string | Record<string, any>, ResponseType>
  >;
};

export type RouteDefinition<
  Path extends RoutePath,
  Interface extends RouteInterfaceDefinition,
> = {
  path: Path;
} & Interface;
