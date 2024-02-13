import { ModelHandlerFactory } from "../handler/model/generation/factory.js";
import {} from "../handler/model/embedding/factory.js";
import { MethodReturnTypes } from "./helper.js";

export type GenerationModelHandlerFactory = MethodReturnTypes<
  typeof ModelHandlerFactory
>;
// export type EmbeddingModelHandlerFactory = MethodReturnTypes<ModelHandlerFactory>;
