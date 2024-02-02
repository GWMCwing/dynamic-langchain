import * as v from "valibot";

const IsIntStringSchema = v.special<`${number}`>(
  (v) => typeof v === "string" && isFinite(parseInt(v)),
);

export const OptionalIntStringSchema = v.transform(
  v.optional(IsIntStringSchema),
  (v) => (v === undefined ? undefined : parseInt(v)),
);
