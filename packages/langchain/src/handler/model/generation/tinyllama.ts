import { env } from "../../../requiredEnv.js";
import { LlamaCppModelHandler } from "./abstract/LlamaCppModelHandler.js";
import { ZephyrTemplateHandler } from "../../prompt/Zephyr.js";
import { ModelsDir } from "../modelDir.js";
import { join as pathJoin } from "path";
import type { LlamaCpp } from "@langchain/community/llms/llama_cpp";
import type { LlamaCppEmbeddings } from "@langchain/community/embeddings/llama_cpp";

const llamaPath = pathJoin(ModelsDir, "generation", env.MODEL_PATH_TINY_LLAMA);

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

  readonly stopTokens: readonly string[] = [
    "<|system|>",
    "<|user|>",
    "<|assistant|>",
    "</s>",
  ] as const;
}
