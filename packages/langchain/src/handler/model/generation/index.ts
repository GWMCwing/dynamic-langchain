import { env } from "../../../requiredEnv";
import { ModelHandlerFactory, type ModelSettings } from "./factory";
import { MistralHandler } from "./mistral";
import { TinyLlamaHandler } from "./tinyllama";

//
// register
//

let generationModelSet = false;

if (env.MODEL_PATH_TINY_LLAMA) {
  generationModelSet = true;
  ModelHandlerFactory.registerModelHandler({
    name: "tinyllama",
    onlyOneInstance: true,
    getInstance: () => new TinyLlamaHandler(),
  });
}

if (env.MODEL_PATH_MISTRAL) {
  generationModelSet = true;
  ModelHandlerFactory.registerModelHandler({
    name: "mistral",
    onlyOneInstance: true,
    getInstance: () => new MistralHandler(),
  });
}

if (!generationModelSet) {
  throw new Error("No generation model set");
}
//
//
//

export { ModelHandlerFactory as ModelFactory };
export type { ModelSettings };
