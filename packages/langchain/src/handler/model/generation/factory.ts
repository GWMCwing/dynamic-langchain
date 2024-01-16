import type { BaseLanguageModel } from "@langchain/core/language_models/base";
import type { Template, TemplateHandler } from "../../prompt/Handler";
import type { ModelHandlerClass } from "./abstract/ModelHandler";
import type { LlamaCppEmbeddings } from "langchain/embeddings/llama_cpp";

const AllowedModelName = ["tinyllama", "mistral"] as const;

type AllowedModelName = (typeof AllowedModelName)[number];

export type ModelSettings<
  GenerationSetting extends Record<string, number | string>,
  M extends BaseLanguageModel,
  E extends LlamaCppEmbeddings,
  T extends Template,
> = {
  name: AllowedModelName;
} & (
  | {
      onlyOneInstance: true;
      instance?: InstanceType<
        ModelHandlerClass<GenerationSetting, M, E, TemplateHandler<T>>
      >;
      getInstance: () => InstanceType<
        ModelHandlerClass<GenerationSetting, M, E, TemplateHandler<T>>
      >;
      HandlerClass?: undefined;
    }
  | {
      onlyOneInstance: false;
      instance?: undefined;
      getInstance?: undefined;
      HandlerClass: () => InstanceType<
        ModelHandlerClass<GenerationSetting, M, E, TemplateHandler<T>>
      >;
    }
);

export class ModelHandlerFactory {
  static registerModelHandler<
    GenerationSetting extends Record<string, number | string>,
    M extends BaseLanguageModel,
    E extends LlamaCppEmbeddings,
    T extends Template,
  >(settings: ModelSettings<GenerationSetting, M, E, T>) {
    if (ModelHandlerFactory.modelSettingMap[settings.name])
      throw new Error(`Model ${settings.name} already registered`);
    ModelHandlerFactory.modelSettingMap[settings.name] = settings;
  }

  static getModelHandler(
    name: AllowedModelName,
  ): InstanceType<
    ModelHandlerClass<
      Record<string, string | number>,
      BaseLanguageModel,
      LlamaCppEmbeddings,
      TemplateHandler<any>
    >
  > {
    const modelSetting = ModelHandlerFactory.modelSettingMap[name];
    if (!modelSetting) throw new Error(`Model ${name} not registered`);
    if (modelSetting.onlyOneInstance) {
      if (!modelSetting.instance) {
        modelSetting.instance = modelSetting.getInstance();
      }
      return modelSetting.instance;
    }
    const modelHandler = modelSetting.HandlerClass();
    return modelHandler;
  }

  static unload(name: AllowedModelName): void {
    ModelHandlerFactory.unloadModel(name);
  }

  static unloadModel(name: AllowedModelName): void {
    const modelSetting = ModelHandlerFactory.modelSettingMap[name];
    if (!modelSetting) throw new Error(`Model ${name} not registered`);
    if (modelSetting.onlyOneInstance) {
      modelSetting.instance?.unloadModel();
    }
  }

  protected static modelSettingMap: Partial<
    Record<
      AllowedModelName,
      ModelSettings<
        Record<string, string | number>,
        BaseLanguageModel,
        LlamaCppEmbeddings,
        Template
      >
    >
  > = {};
}
