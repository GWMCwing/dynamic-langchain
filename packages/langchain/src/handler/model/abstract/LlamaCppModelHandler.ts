import { LlamaCpp } from "langchain/llms/llama_cpp";
import type { TemplateHandler } from "../../prompt/Handler";
import { ModelHandler } from "./ModelHandler";
import type { Concrete } from "../../../types/utility";

export type GenerationSettings = {
  maxToken: LlamaCpp["maxTokens"];
  temperature: LlamaCpp["temperature"];
  topP: LlamaCpp["topP"];
  topK: LlamaCpp["topK"];
};

export abstract class LlamaCppModelHandler<
  TH extends TemplateHandler<any>,
> extends ModelHandler<Concrete<GenerationSettings>, LlamaCpp, TH> {
  //
  constructor(model: LlamaCpp, templateHandler: TH);
  constructor(modelPath: string, templateHandler: TH);
  constructor(modelOrPath: string | LlamaCpp, templateHandler: TH) {
    const model =
      typeof modelOrPath === "string"
        ? new LlamaCpp({
            modelPath: modelOrPath,
            maxConcurrency: 1,
            f16Kv: true,
            verbose: true,
          })
        : modelOrPath;
    super(model, templateHandler);
  }

  setGenerationSettings(settings: Partial<Concrete<GenerationSettings>>): this {
    if (settings.maxToken !== undefined)
      this.model.maxTokens = settings.maxToken;
    if (settings.temperature !== undefined)
      this.model.temperature = settings.temperature;
    if (settings.topP !== undefined) this.model.topP = settings.topP;
    if (settings.topK !== undefined) this.model.topK = settings.topK;
    return this;
  }
}
