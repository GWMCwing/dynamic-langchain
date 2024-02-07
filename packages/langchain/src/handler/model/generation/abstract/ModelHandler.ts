import type { BaseLanguageModel } from "@langchain/core/language_models/base";
import { TemplateHandler, type Template } from "../../../prompt/Handler.js";
import type { Runnable } from "@langchain/core/runnables";
import type { Embeddings } from "@langchain/core/embeddings";

export type ModelHandlerClass<
  GenerationSetting extends Record<string, number | string>,
  M extends BaseLanguageModel,
  E extends Embeddings,
  TH extends TemplateHandler<Template>,
> = new (
  model: M,
  templateHandler: TH,
) => ModelHandler<GenerationSetting, M, E, TH>;

// prompt Template should be the base template of the model, do not include any modification
export abstract class ModelHandler<
  GenerationSetting extends Record<string, number | string>,
  M extends BaseLanguageModel,
  E extends Embeddings,
  TH extends TemplateHandler<Template>,
> {
  constructor(templateHandler: TH) {
    this.templateHandler = templateHandler;
  }

  getModelRunnable(): Runnable {
    if (!this.model) this.model = this.getModel();
    return this.model.bind({
      stop: this.stopTokens as string[],
    });
  }

  getTemplateHandler(): TH {
    return this.templateHandler;
  }

  getModel(): M {
    if (!this.model) this.model = this.loadModel();
    return this.model;
  }
  getEmbeddingModel(): E {
    if (!this.embeddingModel) this.embeddingModel = this.loadEmbeddingModel();
    return this.embeddingModel;
  }
  //
  protected abstract loadModel(): M;
  protected abstract loadEmbeddingModel(): E;
  protected unloadModel() {
    this.model = undefined;
  }
  unsafe_forceUnloadModel() {
    this.model = undefined;
  }
  unsafe_forceUnloadEmbeddingModel() {
    this.embeddingModel = undefined;
  }

  //
  abstract setGenerationSettings(settings: Partial<GenerationSetting>): this;
  //
  protected model?: M;
  protected embeddingModel?: E;
  protected templateHandler: TH;
  //
  abstract readonly stopTokens: readonly string[];
}
