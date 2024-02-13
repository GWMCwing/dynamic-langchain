export type MethodReturnTypes<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? {
        Params: Parameters<T[K]>;
        Returns: ReturnType<T[K]>;
      }
    : never;
};
