type HeaderDefinition = Record<string, string>;

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export type BaseRequestDefinition<
  Method extends RequestMethod,
  Header extends Record<string, any> = {},
  Body extends Record<string, any> = {},
  Params extends Record<string, any> = {},
  Query extends Record<string, any> = {},
> = {
  method: Method;
  headers: Header & HeaderDefinition;
  body: Body;
  params: Params;
  query: Query;
};

export type GetRequestDefinition<
  Header extends Record<string, any> = {},
  Params extends Record<string, any> = {},
  Query extends Record<string, any> = {},
> = BaseRequestDefinition<"GET", Header, Body, Params, Query>;

export type PostRequestDefinition<
  Header extends Record<string, any> = {},
  Body extends Record<string, any> = {},
  Params extends Record<string, any> = {},
  Query extends Record<string, any> = {},
> = BaseRequestDefinition<"POST", Header, Body, Params, Query>;

export type PutRequestDefinition<
  Header extends Record<string, any> = {},
  Body extends Record<string, any> = {},
  Params extends Record<string, any> = {},
  Query extends Record<string, any> = {},
> = BaseRequestDefinition<"PUT", Header, Body, Params, Query>;

export type DeleteRequestDefinition<
  Header extends Record<string, any> = {},
  Params extends Record<string, any> = {},
  Query extends Record<string, any> = {},
> = BaseRequestDefinition<"DELETE", Header, {}, Params, Query>;

export type ResponseDefinition<Body extends Record<string, any> | string = {}> =
  {
    body: Body;
  };
