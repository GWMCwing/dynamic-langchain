import type { BaseLanguageModel } from "@langchain/core/language_models/base";
import { TemplateHandler } from "../../prompt/Handler";
import type {
  ParamsFromFString,
  PromptTemplate,
} from "@langchain/core/prompts";
import type { Runnable } from "@langchain/core/runnables";
import type { Embeddings } from "@langchain/core/embeddings";

export type ModelHandlerClass<
  GenerationSetting extends Record<string, number | string>,
  M extends BaseLanguageModel,
  E extends Embeddings,
  TH extends TemplateHandler<any>,
> = new (
  model: M,
  templateHandler: TH,
) => ModelHandler<GenerationSetting, M, E, TH>;

// prompt Template should be the base template of the model, do not include any modification
export abstract class ModelHandler<
  GenerationSetting extends Record<string, number | string>,
  M extends BaseLanguageModel,
  E extends Embeddings,
  TH extends TemplateHandler<any>,
> {
  constructor(templateHandler: TH) {
    this.templateHandler = templateHandler;
  }

  getModelRunnable(): Runnable {
    if (!this.model) this.model = this.loadModel();
    return this.model.bind({
      stop: this.stopTokens,
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
  abstract loadModel(): M;
  abstract loadEmbeddingModel(): E;
  unloadModel() {
    this.model = undefined;
  }
  unloadEmbeddingModel() {
    this.embeddingModel = undefined;
  }

  //
  abstract setGenerationSettings(settings: Partial<GenerationSetting>): this;
  //
  protected model?: M;
  protected embeddingModel?: E;
  protected templateHandler: TH;
  //
  abstract readonly stopTokens: string[];
}
