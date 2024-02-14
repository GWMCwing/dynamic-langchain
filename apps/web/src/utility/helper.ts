type EmptyProperties<T> = {
  [P in keyof T]-?: {} extends T[P] ? P : never;
}[keyof T];

export type EmptyToOptional<T> = Partial<Pick<T, EmptyProperties<T>>> &
  Pick<T, Exclude<keyof T, EmptyProperties<T>>>;
