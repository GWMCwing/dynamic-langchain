type HeaderDefinition = Record<string, string>;

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export type BaseRequestDefinition<
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

export type GetRequestDefinition<
  Header extends Record<string, any> = {},
  Params extends Record<string, any> | undefined = undefined,
  Query extends Record<string, any> | undefined = undefined,
> = BaseRequestDefinition<"GET", Header, undefined, Params, Query>;

export type PostRequestDefinition<
  Header extends Record<string, any> = {},
  Body extends Record<string, any> | undefined = undefined,
  Params extends Record<string, any> | undefined = undefined,
  Query extends Record<string, any> | undefined = undefined,
> = BaseRequestDefinition<"POST", Header, Body, Params, Query>;

export type PutRequestDefinition<
  Header extends Record<string, any> = {},
  Body extends Record<string, any> | undefined = undefined,
  Params extends Record<string, any> | undefined = undefined,
  Query extends Record<string, any> | undefined = undefined,
> = BaseRequestDefinition<"PUT", Header, Body, Params, Query>;

export type DeleteRequestDefinition<
  Header extends Record<string, any> = {},
  Params extends Record<string, any> | undefined = undefined,
  Query extends Record<string, any> | undefined = undefined,
> = BaseRequestDefinition<"DELETE", Header, undefined, Params, Query>;

export type ResponseDefinition<
  Body extends Record<string, any> | string | undefined = undefined,
> = {
  body: Body;
};
