import type { BaseLanguageModel } from "langchain/base_language";
import type { Runnable } from "langchain/runnables";
import { TemplateHandler } from "../../prompt/Handler";
import type {
  ParamsFromFString,
  PromptTemplate,
} from "@langchain/core/prompts";

// prompt Template should be the base template of the model, do not include any modification
export abstract class ModelHandler<
  GenerationSetting extends Record<string, number | string>,
  M extends BaseLanguageModel,
  TH extends TemplateHandler<any>,
> {
  constructor(model: M, templateHandler: TH) {
    this.model = model;
    this.templateHandler = templateHandler;
  }

  getModelRunnable(): Runnable {
    return this.model.bind({
      stop: this.stopTokens,
    });
  }

  getPromptTemplate(): PromptTemplate<ParamsFromFString<string>, any> {
    return this.templateHandler.buildTemplate();
  }

  getModel = () => this.model;
  getTemplateHandler = () => this.templateHandler;

  //
  abstract setGenerationSettings(settings: Partial<GenerationSetting>): this;
  //
  protected model: M;
  protected templateHandler: TH;
  //
  abstract readonly stopTokens: string[];
}
