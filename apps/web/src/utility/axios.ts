/* eslint-disable no-unused-vars */
import axios, { AxiosInstance, AxiosRequestConfig, ResponseType } from "axios";
import {
  HeadersOf,
  MethodOf,
  ParamsOf,
  PathOf,
  RequestBodyOf,
  ResponseBodyOf,
  ResponseTypeOf,
} from "@repo/api-types/utility/reducer";
import {
  RouteDefinition,
  RouteInterfaceDefinition,
  RoutePath,
} from "@repo/api-types/utility/route";
import { EmptyToOptional } from "./helper";
import { ChatSession } from "@repo/api-types/route/chat";

type ConfiguredAxiosConfig = Pick<
  AxiosRequestConfig,
  "params" | "baseURL" | "headers" | "data" | "method" | "url"
>;

type ConfigurableAxiosConfig = Omit<
  AxiosRequestConfig,
  keyof ConfiguredAxiosConfig
>;

type ConfigurableAxiosConfigWithResponseType = ConfigurableAxiosConfig &
  Required<Pick<AxiosRequestConfig, "responseType">>;

type AxiosFetchDataParams<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends MethodOf<Route>,
> = EmptyToOptional<{
  headers: HeadersOf<Route, Method>;
  params: ParamsOf<Route, Method>;
  body: RequestBodyOf<Route, Method>;
  config: ConfigurableAxiosConfig;
}>;

function defaultedAxiosFetchParams<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends MethodOf<Route>,
>(
  responseType: ResponseTypeOf<Route, Method>,
  data: AxiosFetchDataParams<Route, Method>,
) {
  return {
    headers: {},
    params: {},
    body: {},
    config: {
      responseType: responseType,
    } as ConfigurableAxiosConfigWithResponseType,
    ...data,
  } as const;
}

function AxiosGET<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends "GET" & MethodOf<Route>,
>(
  axiosInstance: AxiosInstance,
  url: PathOf<Route>,
  responseType: ResponseTypeOf<Route, Method>,
  data: AxiosFetchDataParams<Route, Method>,
) {
  const GET = axiosInstance.get<ResponseBodyOf<Route, Method>>;
  const { body, ...config } = defaultedAxiosFetchParams(responseType, data);
  return GET.bind(null, url, config);
}

function AxiosPOST<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends "POST" & MethodOf<Route>,
>(
  axiosInstance: AxiosInstance,
  url: PathOf<Route>,
  responseType: ResponseTypeOf<Route, Method>,
  data: AxiosFetchDataParams<Route, Method>,
) {
  const POST = axiosInstance.post<ResponseBodyOf<Route, Method>>;
  const { body, ...config } = defaultedAxiosFetchParams(responseType, data);
  return POST.bind(null, url, body, config);
}

function AxiosPUT<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends "PUT" & MethodOf<Route>,
>(
  axiosInstance: AxiosInstance,
  url: PathOf<Route>,
  responseType: ResponseTypeOf<Route, Method>,
  data: AxiosFetchDataParams<Route, Method>,
) {
  const PUT = axiosInstance.put<ResponseBodyOf<Route, Method>>;
  const { body, ...config } = defaultedAxiosFetchParams(responseType, data);
  return PUT.bind(null, url, body, config);
}

function AxiosDELETE<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends "DELETE" & MethodOf<Route>,
>(
  axiosInstance: AxiosInstance,
  url: PathOf<Route>,
  responseType: ResponseTypeOf<Route, Method>,
  data: AxiosFetchDataParams<Route, Method>,
) {
  const DELETE = axiosInstance.delete<ResponseBodyOf<Route, Method>>;
  const { body, ...config } = defaultedAxiosFetchParams(responseType, data);
  return DELETE.bind(null, url, config);
}

function AxiosFetch<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends MethodOf<Route>,
>(
  method: "GET",
  url: PathOf<Route>,
  responseType: ResponseTypeOf<Route, Method>,
  data: AxiosFetchDataParams<Route, Method>,
): ReturnType<typeof AxiosGET<Route, "GET">>;
// eslint-disable-next-line no-redeclare
function AxiosFetch<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends MethodOf<Route>,
>(
  method: "POST",
  url: PathOf<Route>,
  responseType: ResponseTypeOf<Route, Method>,
  data: AxiosFetchDataParams<Route, Method>,
): ReturnType<typeof AxiosPOST<Route, "POST">>;
// eslint-disable-next-line no-redeclare
function AxiosFetch<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends MethodOf<Route>,
>(
  method: "PUT",
  url: PathOf<Route>,
  responseType: ResponseTypeOf<Route, Method>,
  data: AxiosFetchDataParams<Route, Method>,
): ReturnType<typeof AxiosPUT<Route, "PUT">>;
// eslint-disable-next-line no-redeclare
function AxiosFetch<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends MethodOf<Route>,
>(
  method: "DELETE",
  url: PathOf<Route>,
  responseType: ResponseTypeOf<Route, Method>,
  data: AxiosFetchDataParams<Route, Method>,
): ReturnType<typeof AxiosDELETE<Route, "DELETE">>;
// eslint-disable-next-line no-redeclare
function AxiosFetch<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends MethodOf<Route>,
>(
  method: Method,
  url: PathOf<Route>,
  responseType: ResponseTypeOf<Route, Method>,
  data: AxiosFetchDataParams<Route, Method>,
) {
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });
  const defaultedData = defaultedAxiosFetchParams(responseType, data);
  //
  if (method === "GET") {
    return AxiosGET(axiosInstance, url, responseType, defaultedData);
  }
  if (method === "POST") {
    return AxiosPOST(axiosInstance, url, responseType, defaultedData);
  }
  if (method === "PUT") {
    return AxiosPUT(axiosInstance, url, responseType, defaultedData);
  }
  if (method === "DELETE") {
    return AxiosDELETE(axiosInstance, url, responseType, defaultedData);
  }
  throw new Error("Invalid Method");
  //
}

// function AxiosFetchWithAuth<
//   Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
//   Method extends MethodOf<Route>,
// >(
//   method: Method,
//   url: PathOf<Route>,
//   headers: HeadersOf<Route, Method>,
//   params: ParamsOf<Route, Method>,
//   body: RequestBodyOf<Route, Method>,
//   auth: string,
//   config: ConfigurableAxiosConfig = {},
// ) {
//   const header = {
//     ...headers,
//     Authorization: auth,
//   } satisfies HeaderWithAuth;
//   return AxiosFetch(method, url, header, params, body, config);
// }

export { AxiosFetch };
