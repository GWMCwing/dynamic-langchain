import { RouteDefinition, RoutePath } from "./route.js";

export type ResponseOf<Route extends RouteDefinition<any, any>> =
  Route["response"];
//
export type RequestOf<Route extends RouteDefinition<any, any>> =
  Route["request"];
//
export type BodyOf<Route extends RouteDefinition<any, any>> =
  ResponseOf<Route>["body"];
//
export type ParamsOf<Route extends RouteDefinition<any, any>> =
  RequestOf<Route>["params"];
//
export type QueryOf<Route extends RouteDefinition<any, any>> =
  RequestOf<Route>["query"];
//
export type HeadersOf<Route extends RouteDefinition<any, any>> =
  RequestOf<Route>["headers"];
//
export type MethodOf<Route extends RouteDefinition<any, any>> =
  RequestOf<Route>["method"];
//
export type PathOf<Route> = Route extends { path: infer P }
  ? P extends RoutePath
    ? P
    : Route extends RoutePath
      ? Route
      : never
  : never;
