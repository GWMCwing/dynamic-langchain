import { env } from "../../../requiredEnv.js";
import { ModelHandlerFactory } from "./factory.js";
import { MistralHandler } from "./mistral.js";
import { TinyLlamaHandler } from "./tinyllama.js";

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
    referenceCount: 0,
  });
}

if (env.MODEL_PATH_MISTRAL) {
  generationModelSet = true;
  ModelHandlerFactory.registerModelHandler({
    name: "mistral",
    onlyOneInstance: true,
    getInstance: () => new MistralHandler(),
    referenceCount: 0,
  });
}

if (!generationModelSet) {
  throw new Error("No generation model set");
}
//
//
//

export async function getGenerationModelFactory() {
  if (!ModelHandlerFactory.ready) await ModelHandlerFactory.init();
  return ModelHandlerFactory;
}
