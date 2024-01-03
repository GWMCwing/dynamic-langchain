export type Concrete<Type> = {
  [Key in keyof Type]-?: Exclude<Type[Key], undefined>;
};
