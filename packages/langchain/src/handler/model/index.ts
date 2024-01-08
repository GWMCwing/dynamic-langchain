import { env } from "../../requiredEnv";
import { ModelHandlerFactory, type ModelSettings } from "./factory";
import { MistralHandler } from "./mistral";
import { TinyLlamaHandler } from "./tinyllama";

//
// register
//

if (env.MODEL_PATH_TINY_LLAMA)
  ModelHandlerFactory.registerModelHandler({
    name: "tinyllama",
    onlyOneInstance: true,
    getInstance: () => new TinyLlamaHandler(),
  });

if (env.MODEL_PATH_MISTRAL)
  ModelHandlerFactory.registerModelHandler({
    name: "mistral",
    onlyOneInstance: true,
    getInstance: () => new MistralHandler(),
  });

//
//
//

export { ModelHandlerFactory as ModelFactory };
export type { ModelSettings };
