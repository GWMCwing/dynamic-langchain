// import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import { OpenAIEmbeddings } from "@langchain/openai";
// import { LlamaCppEmbeddings } from "langchain/embeddings/llama_cpp";

// import { join as pathJoin } from "path";
// import { env } from "../requiredEnv";

// const llamaEmbeddingPath = pathJoin(
//   import.meta.dir,
//   `../models/${env.EMBEDDING_MODEL_PATH}`,
// );

// const llamaPath = pathJoin(
//   import.meta.dir,
//   `../models/${env.MODEL_PATH_TINY_LLAMA}`,
// );

// const embeddings = new LlamaCppEmbeddings({
//   modelPath: llamaPath,
//   embedding: true,
// });

// const vectorStore = await MemoryVectorStore.fromTexts(
//   ["Hello world", "Bye bye", "hello nice world"],
//   [{ id: 2 }, { id: 1 }, { id: 3 }],
//   embeddings,
// );

// const resultOne = await vectorStore.similaritySearch("nice nice", 1);
// console.log(resultOne);

// /*
//   [
//     Document {
//       pageContent: "Hello world",
//       metadata: { id: 2 }
//     }
//   ]
// */
