type HeaderDefinition = Record<string, string>;

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export type RequestDefinition<
  Method extends RequestMethod,
  Header extends Record<string, any> = {},
  Body extends Record<string, any> | undefined = undefined,
  Params extends Record<string, any> | undefined = undefined,
  Query extends Record<string, any> | undefined = undefined,
> = {
  method: Method;
  headers: Header & HeaderDefinition;
  body: Body;
  params: Params;
  query: Query;
};

export type ResponseDefinition<
  Body extends Record<string, any> | string | undefined = undefined,
> = {
  body: Body;
};

export type RouteDefinition<
  Path extends string = `/${string}`,
  Request extends
    RequestDefinition<RequestMethod> = RequestDefinition<RequestMethod>,
  Response extends ResponseDefinition = ResponseDefinition,
> = {
  path: Path;
  request: Request;
  response: Response;
};

export type ResponseOf<Route extends RouteDefinition> = Route["response"];
export type RequestOf<Route extends RouteDefinition> = Route["request"];
export type BodyOf<Route extends RouteDefinition> = ResponseOf<Route>["body"];
export type ParamsOf<Route extends RouteDefinition> =
  RequestOf<Route>["params"];
export type QueryOf<Route extends RouteDefinition> = RequestOf<Route>["query"];
export type HeadersOf<Route extends RouteDefinition> =
  RequestOf<Route>["headers"];
export type MethodOf<Route extends RouteDefinition> =
  RequestOf<Route>["method"];
export type PathOf<Route extends RouteDefinition> = Route["path"];
