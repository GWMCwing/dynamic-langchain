// TODO: "using" keywords

import type { Embeddings } from "@langchain/core/embeddings";

// prompt Template should be the base template of the model, do not include any modification
export abstract class ModelHandler<E extends Embeddings> {
  getEmbeddingModel(): E {
    if (!this.embeddingModel) this.embeddingModel = this.loadEmbeddingModel();
    return this.embeddingModel;
  }
  //
  abstract loadEmbeddingModel(): E;
  unloadEmbeddingModel() {
    this.embeddingModel = undefined;
  }
  //
  protected embeddingModel?: E;
}
