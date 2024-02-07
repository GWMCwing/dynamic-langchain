// process.env.MODEL_PATH_TINY_LLAMA = "tinyllama-1.1b-chat-v1.0.Q5_K_M.gguf";
// process.env.MODEL_PATH_MISTRAL = "mistral-7b-instruct-v0.2.Q5_K_M.gguf";

// import {} from "../handler/model/generation/index.js";
// import { ModelHandlerFactory } from "../handler/model/generation/factory.js";
// import { RunnableSequence, type RunnableLike } from "@langchain/core/runnables";
// import { StringOutputParser } from "@langchain/core/output_parsers";
// {
//   using handlerResource =
//     ModelHandlerFactory.getModelHandlerFactoryResource("mistral");
//   const generationModelHandler = handlerResource.resource;

//   const model = generationModelHandler.getModelRunnable();
//   const runnableSequence: RunnableLike[] = [];
//   const template = generationModelHandler.getTemplateHandler().buildTemplate();
//   runnableSequence.push(template);
//   runnableSequence.push(model);
//   runnableSequence.push(new StringOutputParser());
//   //
//   const result = await RunnableSequence.from(runnableSequence as any).invoke({
//     prompt: "Who are you",
//     context: "",
//     system_message: "You are Mistral",
//   });
//   console.log(result);
// }

// {
//   using handlerResource =
//     ModelHandlerFactory.getModelHandlerFactoryResource("mistral");
//   const generationModelHandler = handlerResource.resource;

//   const model = generationModelHandler.getModelRunnable();
//   const runnableSequence: RunnableLike[] = [];
//   const template = generationModelHandler.getTemplateHandler().buildTemplate();
//   runnableSequence.push(template);
//   runnableSequence.push(model);
//   runnableSequence.push(new StringOutputParser());
//   //
//   const result = await RunnableSequence.from(runnableSequence as any).invoke({
//     prompt: "Who are you",
//     context: "",
//     system_message: "You are Mistral",
//   });
//   console.log(result);
// }
