import { ChatLlamaCpp } from "langchain/chat_models/llama_cpp";
import { join as pathJoin } from "path";
import { env } from "./requiredEnv";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "langchain/runnables";
import { RunnablePassthrough } from "langchain/schema/runnable";
import { LlamaCppEmbeddings } from "langchain/embeddings/llama_cpp";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "langchain/document";
// import { ZephyrTemplateHandler } from "./handler/prompt/Zephyr";
import { LlamaCpp } from "langchain/llms/llama_cpp";
import {
  SystemMessage,
  type BaseMessage,
  HumanMessage,
} from "langchain/schema";

const llamaPath = pathJoin(import.meta.dir, `../models/${env.MODEL_PATH}`);

const model = new LlamaCpp({
  modelPath: llamaPath,
  gpuLayers: 0,
  maxConcurrency: 1,
  verbose: true,
});

const embeddings = new LlamaCppEmbeddings({ modelPath: llamaPath });

const vectorStore = await MemoryVectorStore.fromTexts(
  ["your name is John"],
  [{}],
  embeddings,
);

vectorStore.addDocuments([
  new Document({
    pageContent: "your name is not John",
  }),
]);

// console.log(await vectorStore.similaritySearchWithScore("not", 2));

const retriever = vectorStore.asRetriever({
  k: 1,
});

const outputParser = new StringOutputParser();

const llmChain = RunnableSequence.from([
  RunnablePassthrough.assign({
    prefix: async (input: Record<string, any>) => input.prefix,
    system_message: async (input: Record<string, any>) => input.system_message,
    prompt: async (input: Record<string, any>) => input.prompt,
  }),
  RunnablePassthrough.assign({
    context: (input: Record<string, any>) => {
      console.log("input", input);
      return retriever.invoke(input.prompt).then((response) => {
        const res = response[0].pageContent;
        console.log(res);
        return res;
      });
    },
  }),
  (input) => {
    console.log("input", input);
    const message: BaseMessage[] = [];
    if (input.system_message)
      message.push(new SystemMessage(input.system_message));
    if (input.context) message.push(new SystemMessage(input.context));
    if (input.prompt) message.push(new HumanMessage(input.prompt));
    return message;
  },
  model,
  outputParser,
]);

const system_message = `You are a helpful AI assistant that provides information based on your knowledge without any creation of unknown information.
If you do not know the answer to a question, you must say "I don't know".`;

const message = "What is your name?";

type GenerationSettings = {
  maxToken: ChatLlamaCpp["maxTokens"];
  temperature: ChatLlamaCpp["temperature"];
  topP: ChatLlamaCpp["topP"];
  topK: ChatLlamaCpp["topK"];
};

function setGenerationSettings(
  model: ChatLlamaCpp | LlamaCpp,
  settings: Partial<GenerationSettings>,
) {
  if (settings.maxToken !== undefined) model.maxTokens = settings.maxToken;
  if (settings.temperature !== undefined)
    model.temperature = settings.temperature;
  if (settings.topP !== undefined) model.topP = settings.topP;
  if (settings.topK !== undefined) model.topK = settings.topK;
}

setGenerationSettings(model, {
  maxToken: 100,
  temperature: 0.5,
  topP: 1,
  topK: 40,
});

export const response = await llmChain.invoke({
  system_message,
  prompt: message,
  prefix: "You: ",
});

console.log(response);
