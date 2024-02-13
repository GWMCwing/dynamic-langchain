export type HeaderDefinition = Record<string, string>;
export type EmptyHeader = {};
export type HeaderWithAuth = HeaderDefinition & { Authorization: string };
//
export type EmptyBody = {};
export type EmptyParams = {};
export type EmptyQuery = {};

//
//
//
export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export type BaseRequestDefinition<
  Method extends RequestMethod,
  Header extends Record<string, any> = EmptyHeader,
  Body extends Record<string, any> = EmptyBody,
  Params extends Record<string, any> = EmptyParams,
  Query extends Record<string, any> = EmptyQuery,
> = {
  method: Method;
  headers: Header;
  body: Body;
  params: Params;
  query: Query;
};

export type GetRequestDefinition<
  Header extends Record<string, any> = EmptyHeader,
  Params extends Record<string, any> = EmptyParams,
  Query extends Record<string, any> = EmptyQuery,
> = BaseRequestDefinition<"GET", Header, Body, Params, Query>;

export type PostRequestDefinition<
  Header extends Record<string, any> = EmptyHeader,
  Body extends Record<string, any> = EmptyBody,
  Params extends Record<string, any> = EmptyParams,
  Query extends Record<string, any> = EmptyQuery,
> = BaseRequestDefinition<"POST", Header, Body, Params, Query>;

export type PutRequestDefinition<
  Header extends Record<string, any> = EmptyHeader,
  Body extends Record<string, any> = EmptyBody,
  Params extends Record<string, any> = EmptyParams,
  Query extends Record<string, any> = EmptyQuery,
> = BaseRequestDefinition<"PUT", Header, Body, Params, Query>;

export type DeleteRequestDefinition<
  Header extends Record<string, any> = EmptyHeader,
  Params extends Record<string, any> = EmptyParams,
  Query extends Record<string, any> = EmptyQuery,
> = BaseRequestDefinition<"DELETE", Header, {}, Params, Query>;

export type ResponseDefinition<Body extends Record<string, any> | string = {}> =
  {
    body: Body;
  };
