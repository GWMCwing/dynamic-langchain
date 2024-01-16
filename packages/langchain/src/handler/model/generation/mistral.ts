import { env } from "../../../requiredEnv";
import { LlamaCppModelHandler } from "./abstract/LlamaCppModelHandler";
import { MistralTemplateHandler } from "../../prompt/Mistral";
import { join as pathJoin } from "path";
import type { LlamaCpp } from "langchain/llms/llama_cpp";
import type { LlamaCppEmbeddings } from "langchain/embeddings/llama_cpp";

const llamaPath = pathJoin(
  import.meta.dir,
  `../../../models/${env.MODEL_PATH_MISTRAL}`,
);

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

  readonly stopTokens: string[] = [] as const;
}
