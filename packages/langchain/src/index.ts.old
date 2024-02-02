import { ChatLlamaCpp } from "langchain/chat_models/llama_cpp";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "langchain/runnables";
import { RunnablePassthrough } from "langchain/schema/runnable";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "langchain/document";
import { LlamaCpp } from "langchain/llms/llama_cpp";
import { ZephyrTemplateHandler } from "./handler/prompt/Zephyr";
import type { VectorStore } from "@langchain/core/vectorstores";
import { ModelFactory } from "./handler/model/generation";

const modelHandler = ModelFactory.getModelHandler("mistral");
const model = modelHandler.getModel();
const embeddingModel = modelHandler.getEmbeddingModel();

const vectorStore = await MemoryVectorStore.fromTexts(
  ["your name is John"],
  [{}],
  embeddingModel,
);

await vectorStore.addDocuments([
  new Document({
    pageContent: "your name is not Chris",
  }),
]);

await vectorStore.addDocuments([
  new Document({
    pageContent: "your name is not Amy",
  }),
]);

// console.log(
//   await vectorStore.similaritySearchWithScore("What is NOT your name"),
// );

const retriever = vectorStore.asRetriever({
  k: 2,
});

const promptTemplate = modelHandler
  .getTemplateHandler()
  .setContextPrefix("System Context:\n")
  .setPromptPrefix("Question:\n")
  .setResponsePrefix("You:")
  .buildTemplate();

const outputParser = new StringOutputParser();

function getVectorStoreRelevantContextRunnable(
  vectorStore: VectorStore,
  k?: number,
) {
  return async (prompt: string) => {
    const response = await vectorStore.similaritySearchWithScore(prompt, k);
    console.log(response);
    return response
      .filter((d) => !isNaN(d[1]))
      .map((d) => d[0].pageContent)
      .join("\n");
  };
}

const llmChain = RunnableSequence.from([
  RunnablePassthrough.assign({
    prefix: async (input: Record<string, any>) => input.prefix,
    system_message: async (input: Record<string, any>) => input.system_message,
    prompt: async (input: Record<string, any>) => input.prompt,
  }),
  RunnablePassthrough.assign({
    context: async (input: Record<string, any>) =>
      await getVectorStoreRelevantContextRunnable(vectorStore, 1)(input.prompt),
  }),
  promptTemplate,
  model.bind({
    stop: ["<|system|>", "<|user|>", "<|assistant|>", "</s>"],
  }),
  outputParser,
]);

const system_message = `You are a helpful AI assistant that provides information based on your knowledge without any creation of unknown information.
If you do not know the answer to a question, you must say "I don't know".`;

const message = "Are you Amy?";

modelHandler.setGenerationSettings({
  temperature: 0.98,
  topP: 0.37,
  topK: 100,
});

export const response = await llmChain.invoke({
  system_message,
  prompt: message,
  prefix: "Response of the question:",
});

console.log(response);
