import { env } from "../../requiredEnv";
import { LlamaCppModelHandler } from "./abstract/LlamaCppModelHandler";
import { ZephyrTemplateHandler } from "../prompt/Zephyr";
import { join as pathJoin } from "path";
import type { LlamaCpp } from "langchain/llms/llama_cpp";

const llamaPath = pathJoin(
  import.meta.dir,
  `../../../models/${env.MODEL_PATH}`,
);

class TinyLlamaHandler extends LlamaCppModelHandler<ZephyrTemplateHandler> {
  constructor();
  constructor(model: LlamaCpp);
  constructor(model?: LlamaCpp) {
    const templateHandler = new ZephyrTemplateHandler();
    model ? super(model, templateHandler) : super(llamaPath, templateHandler);
  }

  readonly stopTokens: string[] = [
    "<|system|>",
    "<|user|>",
    "<|assistant|>",
    "</s>",
  ] as const;
}

export type { TinyLlamaHandler };

let model: LlamaCpp;

export const getTinyLlamaHandler = () => {
  if (model) return new TinyLlamaHandler(model);
  const modelHandler = new TinyLlamaHandler();
  model = modelHandler.getModel();
  return modelHandler;
};
