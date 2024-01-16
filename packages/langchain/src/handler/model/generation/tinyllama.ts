import { env } from "../../../requiredEnv";
import { LlamaCppModelHandler } from "./abstract/LlamaCppModelHandler";
import { ZephyrTemplateHandler } from "../../prompt/Zephyr";
import { join as pathJoin } from "path";
import type { LlamaCpp } from "langchain/llms/llama_cpp";
import type { LlamaCppEmbeddings } from "langchain/embeddings/llama_cpp";

const llamaPath = pathJoin(
  import.meta.dir,
  `../../../models/${env.MODEL_PATH_TINY_LLAMA}`,
);

export class TinyLlamaHandler extends LlamaCppModelHandler<ZephyrTemplateHandler> {
  constructor();
  constructor(model: LlamaCpp, embeddingModel: LlamaCppEmbeddings);
  constructor(model?: LlamaCpp, embeddingModel?: LlamaCppEmbeddings) {
    const templateHandler = new ZephyrTemplateHandler();
    const contextSize = 2048;
    model && embeddingModel
      ? super(model, embeddingModel, contextSize, templateHandler)
      : super(llamaPath, llamaPath, contextSize, templateHandler);
  }

  readonly stopTokens: string[] = [
    "<|system|>",
    "<|user|>",
    "<|assistant|>",
    "</s>",
  ] as const;
}
