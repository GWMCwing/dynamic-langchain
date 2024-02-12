import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  HeadersOf,
  MethodOf,
  ParamsOf,
  PathOf,
  RequestBodyOf,
  ResponseBodyOf,
} from "@repo/api-types/utility/reducer";
import {
  RouteDefinition,
  RouteInterfaceDefinition,
  RoutePath,
} from "@repo/api-types/utility/route";

type ConfiguredAxiosConfig = Pick<
  AxiosRequestConfig,
  "params" | "baseURL" | "headers" | "data" | "method" | "responseType" | "url"
>;
type ConfigurableAxiosConfig = Omit<
  AxiosRequestConfig,
  keyof ConfiguredAxiosConfig
>;

function AxiosGET<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends "GET" & MethodOf<Route>,
>(
  axiosInstance: AxiosInstance,
  url: PathOf<Route>,
  headers: HeadersOf<Route, Method> = {},
  params: ParamsOf<Route, Method> = {},
  body: RequestBodyOf<Route, Method> = {},
  config: ConfigurableAxiosConfig = {},
) {
  const GET = axiosInstance.get<ResponseBodyOf<Route, Method>>;
  return GET.bind(null, url, { params, headers, ...config });
}

function AxiosPOST<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends "POST" & MethodOf<Route>,
>(
  axiosInstance: AxiosInstance,
  url: PathOf<Route>,
  headers: HeadersOf<Route, Method> = {},
  params: ParamsOf<Route, Method> = {},
  body: RequestBodyOf<Route, Method> = {},
  config: ConfigurableAxiosConfig = {},
) {
  const POST = axiosInstance.post<ResponseBodyOf<Route, Method>>;
  return POST.bind(null, url, body, { params, headers, ...config });
}

function AxiosPUT<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends "PUT" & MethodOf<Route>,
>(
  axiosInstance: AxiosInstance,
  url: PathOf<Route>,
  headers: HeadersOf<Route, Method> = {},
  params: ParamsOf<Route, Method> = {},
  body: RequestBodyOf<Route, Method> = {},
  config: ConfigurableAxiosConfig = {},
) {
  const PUT = axiosInstance.put<ResponseBodyOf<Route, Method>>;
  return PUT.bind(null, url, body, { params, headers, ...config });
}

function AxiosDELETE<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends "DELETE" & MethodOf<Route>,
>(
  axiosInstance: AxiosInstance,
  url: PathOf<Route>,
  headers: HeadersOf<Route, Method> = {},
  params: ParamsOf<Route, Method> = {},
  body: RequestBodyOf<Route, Method> = {},
  config: ConfigurableAxiosConfig = {},
) {
  const DELETE = axiosInstance.delete<ResponseBodyOf<Route, Method>>;
  return DELETE.bind(null, url, { params, headers, ...config });
}

function AxiosFetch<
  Route extends RouteDefinition<RoutePath, RouteInterfaceDefinition>,
  Method extends MethodOf<Route>,
>(
  method: Method,
  url: PathOf<Route>,
  headers: HeadersOf<Route, Method>,
  params: ParamsOf<Route, Method>,
  body: RequestBodyOf<Route, Method>,
  config: ConfigurableAxiosConfig = {},
) {
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });
  //
  if (method === "GET") {
    return AxiosGET(axiosInstance, url, headers, params, body, config);
  }
  if (method === "POST") {
    return AxiosPOST(axiosInstance, url, headers, params, body, config);
  }
  if (method === "PUT") {
    return AxiosPUT(axiosInstance, url, headers, params, body, config);
  }
  if (method === "DELETE") {
    return AxiosDELETE(axiosInstance, url, headers, params, body, config);
  }
  throw new Error("Invalid Method");
  //
}

export { AxiosFetch };
