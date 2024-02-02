import * as v from "valibot";

const DatabaseConfigSchema_Login = v.object(
  {
    name: v.string(),
    type: v.picklist(["mysql", "postgres"]),
    username: v.string(),
    password: v.string(),
    url: v.string([v.url()]),
  },
  [
    v.forward(
      v.custom(({ type, url }) => {
        return url.startsWith(`${type}://`);
      }),
      ["url"],
    ),
  ],
);

const DatabaseConfigSchema = v.union([DatabaseConfigSchema_Login]);

const SubConfigSchema = v.object({
  systemPromptPrefix: v.optional(v.string(), ""),
  systemPromptSuffix: v.optional(v.string(), ""),
  contextProvider: v.optional(v.array(v.union([DatabaseConfigSchema])), []),
});

export type ChatSessionConfig_SubConfig = v.Output<typeof SubConfigSchema>;
