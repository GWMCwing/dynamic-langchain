import type { BaseLanguageModel } from "@langchain/core/language_models/base";
import type { Template, TemplateHandler } from "../../prompt/Handler";
import type { ModelHandlerClass } from "./abstract/ModelHandler";
import { getDatabase } from "@repo/database";
import { LlamaCppEmbeddings } from "@langchain/community/embeddings/llama_cpp";

const AllowedModelName = ["tinyllama", "mistral"] as const;

export type AllowedModelName = (typeof AllowedModelName)[number];

export type ModelFactoryResource<
  GenerationSetting extends Record<string, number | string> = Record<
    string,
    number | string
  >,
  M extends BaseLanguageModel = BaseLanguageModel,
  E extends LlamaCppEmbeddings = LlamaCppEmbeddings,
  T extends Template = Template,
> = {
  resource: InstanceType<
    ModelHandlerClass<GenerationSetting, M, E, TemplateHandler<T>>
  >;
  [Symbol.dispose](): void;
};

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
      referenceCount: number;
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
  static ready = false;
  static async init() {
    // add all registered models to db
    //
    const db = await getDatabase();
    await db.langChain.model.disableAllEmbeddingModels();
    await db.langChain.model.disableAllGenerationModels();
    //
    const promiseList: ReturnType<
      typeof db.langChain.model.addOrActivateGenerationModel
    >[] = [];
    //
    for (const [name, modelSetting] of Object.entries(
      ModelHandlerFactory.modelSettingMap,
    )) {
      promiseList.push(db.langChain.model.addOrActivateGenerationModel(name));
    }
    await Promise.all(promiseList);
    //
    ModelHandlerFactory.ready = true;
  }

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

  static getModelHandlerFactoryResource(
    name: AllowedModelName,
  ): ModelFactoryResource {
    const modelSetting = ModelHandlerFactory.modelSettingMap[name];
    if (!modelSetting) throw new Error(`Model ${name} not registered`);
    //
    if (modelSetting.onlyOneInstance) {
      modelSetting.referenceCount++;
      if (!modelSetting.instance) {
        modelSetting.instance = modelSetting.getInstance();
      }
      return {
        resource: modelSetting.instance,
        [Symbol.dispose]() {
          modelSetting.referenceCount--;
          ModelHandlerFactory.triggerModelHandlerResourceDispose(name);
        },
      };
    }
    //
    return {
      resource: modelSetting.HandlerClass(),
      [Symbol.dispose]() {},
    };
  }

  static hasModel(name: string): boolean {
    return !!ModelHandlerFactory.modelSettingMap[name as AllowedModelName];
  }

  static getModelsName(): AllowedModelName[] {
    return Object.keys(
      ModelHandlerFactory.modelSettingMap,
    ) as AllowedModelName[];
  }

  static triggerModelHandlerResourceDispose(name: AllowedModelName) {
    const modelSetting = ModelHandlerFactory.modelSettingMap[name];
    if (!modelSetting) throw new Error(`Model ${name} not registered`);
    if (modelSetting.onlyOneInstance) {
      if (modelSetting.referenceCount === 0) {
        modelSetting.instance?.unsafe_forceUnloadModel();
        modelSetting.instance = undefined;
      }
    }
  }

  // static unload(name: AllowedModelName): void {
  //   ModelHandlerFactory.unloadModel(name);
  // }

  // static unloadModel(name: AllowedModelName): void {
  //   const modelSetting = ModelHandlerFactory.modelSettingMap[name];
  //   if (!modelSetting) throw new Error(`Model ${name} not registered`);
  //   if (modelSetting.onlyOneInstance) {
  //     modelSetting.instance?.unloadModel();
  //   }
  // }

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
