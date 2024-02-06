import { TemplateHandler, type Template } from "../../../prompt/Handler";
import { ModelHandler } from "./ModelHandler";
import type { Concrete } from "../../../../types/utility";
import { LlamaCpp } from "@langchain/community/llms/llama_cpp";
import { LlamaCppEmbeddings } from "@langchain/community/embeddings/llama_cpp";

export type GenerationSettings = {
  maxToken: LlamaCpp["maxTokens"];
  temperature: LlamaCpp["temperature"];
  topP: LlamaCpp["topP"];
  topK: LlamaCpp["topK"];
};

export abstract class LlamaCppModelHandler<
  TH extends TemplateHandler<Template>,
> extends ModelHandler<
  Concrete<GenerationSettings>,
  LlamaCpp,
  LlamaCppEmbeddings,
  TH
> {
  //
  constructor(
    modelOrPath: string | LlamaCpp,
    embeddingModelOrPath: string | LlamaCppEmbeddings,
    contextSize: number,
    templateHandler: TH,
  ) {
    super(templateHandler);
    this.modelOrPath = modelOrPath;
    this.embeddingModelOrPath = embeddingModelOrPath;
    this.contextSize = contextSize;
  }

  private modelOrPath: string | LlamaCpp;
  private embeddingModelOrPath: string | LlamaCppEmbeddings;
  private contextSize: number;

  loadModel(): LlamaCpp {
    if (this.model) return this.model;
    this.model =
      typeof this.modelOrPath === "string"
        ? new LlamaCpp({
            modelPath: this.modelOrPath,
            maxConcurrency: 1,
            contextSize: this.contextSize,
            batchSize: this.contextSize,
            f16Kv: true,
            verbose: true,
          })
        : this.modelOrPath;
    return this.model;
  }

  loadEmbeddingModel(): LlamaCppEmbeddings {
    if (this.embeddingModel) return this.embeddingModel;
    this.embeddingModel =
      typeof this.embeddingModelOrPath === "string"
        ? new LlamaCppEmbeddings({
            modelPath: this.embeddingModelOrPath,
            maxConcurrency: 1,
            contextSize: this.contextSize,
            batchSize: this.contextSize,
            f16Kv: true,
          })
        : this.embeddingModelOrPath;
    return this.embeddingModel;
  }

  setGenerationSettings(settings: Partial<Concrete<GenerationSettings>>): this {
    let model = this.model;
    if (!model) {
      model = this.loadModel();
    }
    if (settings.maxToken !== undefined) model.maxTokens = settings.maxToken;
    if (settings.temperature !== undefined)
      model.temperature = settings.temperature;
    if (settings.topP !== undefined) model.topP = settings.topP;
    if (settings.topK !== undefined) model.topK = settings.topK;
    return this;
  }
}
