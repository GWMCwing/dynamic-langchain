import { env } from "../../requiredEnv";
import { LlamaCppModelHandler } from "./abstract/LlamaCppModelHandler";
import type { TemplateHandler } from "../prompt/Handler";
import { ZephyrTemplateHandler } from "../prompt/Zephyr";
import { join as pathJoin } from "path";

const llamaPath = pathJoin(
  import.meta.dir,
  `../../../models/${env.MODEL_PATH}`,
);

class TinyLlamaHandler<
  TH extends TemplateHandler<any>,
> extends LlamaCppModelHandler<TH> {
  constructor(templateHandler: TH) {
    super(llamaPath, templateHandler);
  }

  readonly stopTokens: string[] = [
    "<|system|>",
    "<|user|>",
    "<|assistant|>",
    "</s>",
  ] as const;
}

export type { TinyLlamaHandler };

export const getTinyLlamaHandler = () =>
  new TinyLlamaHandler(new ZephyrTemplateHandler());
