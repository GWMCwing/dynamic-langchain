import { LlamaCppEmbeddings } from "@langchain/community/embeddings/llama_cpp";
import { ModelHandler } from "./ModelHandler.js";

export abstract class LlamaCppModelHandler extends ModelHandler<LlamaCppEmbeddings> {
  //
  constructor(embeddingModelOrPath: string | LlamaCppEmbeddings) {
    super();
    this.embeddingModelOrPath = embeddingModelOrPath;
  }

  private embeddingModelOrPath: string | LlamaCppEmbeddings;

  loadEmbeddingModel(): LlamaCppEmbeddings {
    if (this.embeddingModel) return this.embeddingModel;
    this.embeddingModel =
      typeof this.embeddingModelOrPath === "string"
        ? new LlamaCppEmbeddings({
            modelPath: this.embeddingModelOrPath,
            maxConcurrency: 1,
            embedding: true,
            f16Kv: true,
          })
        : this.embeddingModelOrPath;
    return this.embeddingModel;
  }
}
