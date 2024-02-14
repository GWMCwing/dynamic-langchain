import type { RequestMethod } from "./request.js";
import type {
  RouteDefinition,
  RouteInterfaceDefinition,
  RoutePath,
} from "./route.js";
//
export type MethodOf<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
> = keyof Route & RequestMethod;
//
export type InterfaceOf<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends MethodOf<Route>,
  __Interface extends Route[Method] = Route[Method],
> = __Interface extends undefined ? never : __Interface;
//
export type ResponseOf<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends MethodOf<Route>,
  __Interface extends InterfaceOf<Route, Method> = InterfaceOf<Route, Method>,
> = __Interface["response"];
//
export type RequestOf<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends MethodOf<Route>,
  __Interface extends InterfaceOf<Route, Method> = InterfaceOf<Route, Method>,
> = __Interface["request"];
//
export type RequestBodyOf<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends MethodOf<Route>,
  __Request extends RequestOf<Route, Method> = RequestOf<Route, Method>,
> = __Request["body"];
//
export type ResponseBodyOf<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends MethodOf<Route>,
  __Response extends ResponseOf<Route, Method> = ResponseOf<Route, Method>,
> = __Response["body"];
//
export type ResponseTypeOf<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends MethodOf<Route>,
  __Response extends ResponseOf<Route, Method> = ResponseOf<Route, Method>,
> = __Response["type"];
//
export type BodyOf<
  T extends "Response" | "Request",
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends MethodOf<Route>,
> = T extends "Response"
  ? ResponseBodyOf<Route, Method>
  : RequestBodyOf<Route, Method>;
//
export type ParamsOf<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends MethodOf<Route>,
  __Request extends RequestOf<Route, Method> = RequestOf<Route, Method>,
> = __Request["params"];
//
export type QueryOf<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends MethodOf<Route>,
  __Request extends RequestOf<Route, Method> = RequestOf<Route, Method>,
> = __Request["query"];
//
export type HeadersOf<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends MethodOf<Route>,
  __Request extends RequestOf<Route, Method> = RequestOf<Route, Method>,
> = __Request["headers"];
//
export type PathOf<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
> = Route["path"];
