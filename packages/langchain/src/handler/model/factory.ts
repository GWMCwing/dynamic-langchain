import type { BaseLanguageModel } from "langchain/base_language";
import type { TemplateHandler, TemplateHandlerClass } from "../prompt/Handler";
import type { ModelHandlerClass } from "./abstract/ModelHandler";

const AllowedModelName = ["tinyllama"] as const;

type AllowedModelName = (typeof AllowedModelName)[number];

type ModelSettings<
  GenerationSetting extends Record<string, number | string>,
  M extends BaseLanguageModel,
  T extends string,
> = {
  name: AllowedModelName;
} & (
  | {
      onlyOneInstance: true;
      instance: InstanceType<
        ModelHandlerClass<GenerationSetting, M, TemplateHandler<T>>
      >;
      HandlerClass: never;
    }
  | {
      onlyOneInstance: false;
      instance: never;
      HandlerClass: () => InstanceType<
        ModelHandlerClass<GenerationSetting, M, TemplateHandler<T>>
      >;
    }
);

export class ModelFactory {
  static registerModel<
    GenerationSetting extends Record<string, number | string>,
    M extends BaseLanguageModel,
    T extends string,
  >(settings: ModelSettings<GenerationSetting, M, T>) {
    if (this.modelSettingMap[settings.name])
      throw new Error(`Model ${settings.name} already registered`);
    this.modelSettingMap[settings.name] = settings;
  }

  static getModel(
    name: AllowedModelName,
  ): InstanceType<ModelHandlerClass<any, any, any>> {
    const modelSetting = this.modelSettingMap[name];
    if (!modelSetting) throw new Error(`Model ${name} not registered`);
    if (modelSetting.onlyOneInstance) return modelSetting.instance;
    const modelHandler = modelSetting.HandlerClass();
    return modelHandler;
  }

  protected static modelSettingMap: Partial<
    Record<AllowedModelName, ModelSettings<any, any, any>>
  >;
}
