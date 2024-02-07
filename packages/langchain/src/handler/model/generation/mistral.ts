import { env } from "../../../requiredEnv.js";
import { LlamaCppModelHandler } from "./abstract/LlamaCppModelHandler.js";
import { MistralTemplateHandler } from "../../prompt/Mistral.js";
import { ModelsDir } from "../modelDir.js";
import { join as pathJoin } from "path";
import type { LlamaCpp } from "@langchain/community/llms/llama_cpp";
import type { LlamaCppEmbeddings } from "@langchain/community/embeddings/llama_cpp";

const llamaPath = pathJoin(ModelsDir, "generation", env.MODEL_PATH_MISTRAL);

export class MistralHandler extends LlamaCppModelHandler<MistralTemplateHandler> {
  constructor();
  constructor(model: LlamaCpp, embeddingModel: LlamaCppEmbeddings);
  constructor(model?: LlamaCpp, embeddingModel?: LlamaCppEmbeddings) {
    const templateHandler = new MistralTemplateHandler();
    const contextSize = 4096;
    model && embeddingModel
      ? super(model, embeddingModel, contextSize, templateHandler)
      : super(llamaPath, llamaPath, contextSize, templateHandler);
  }

  readonly stopTokens: readonly string[] = [] as const;
}
