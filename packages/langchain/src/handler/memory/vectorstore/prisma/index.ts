// import type { Callbacks } from "@langchain/core/callbacks/manager";
// import type { DocumentInterface } from "@langchain/core/documents";
// import type { EmbeddingsInterface } from "@langchain/core/embeddings";
// import { VectorStore, VectorStoreRetriever, type MaxMarginalRelevanceSearchOptions, type VectorStoreInterface, type VectorStoreRetrieverInput } from "@langchain/core/vectorstores";

// class PrismaVectorStore_Memory implements VectorStoreInterface{
//   FilterType: string | object;
//   embeddings: EmbeddingsInterface;
//   _vectorstoreType(): string {
//     throw new Error("Method not implemented.");
//   }
//   addVectors(vectors: number[][], documents: DocumentInterface<Record<string, any>>[], options?: { [x: string]: any; } | undefined): Promise<void | string[]> {
//     throw new Error("Method not implemented.");
//   }
//   addDocuments(documents: DocumentInterface<Record<string, any>>[], options?: { [x: string]: any; } | undefined): Promise<void | string[]> {
//     throw new Error("Method not implemented.");
//   }
//   delete(_params?: Record<string, any> | undefined): Promise<void> {
//     throw new Error("Method not implemented.");
//   }
//   similaritySearchVectorWithScore(query: number[], k: number, filter?: this["FilterType"] | undefined): Promise<[DocumentInterface<Record<string, any>>, number][]> {
//     throw new Error("Method not implemented.");
//   }
//   similaritySearch(query: string, k?: number | undefined, filter?: this["FilterType"] | undefined, callbacks?: Callbacks | undefined): Promise<DocumentInterface<Record<string, any>>[]> {
//     throw new Error("Method not implemented.");
//   }
//   similaritySearchWithScore(query: string, k?: number | undefined, filter?: this["FilterType"] | undefined, callbacks?: Callbacks | undefined): Promise<[DocumentInterface<Record<string, any>>, number][]> {
//     throw new Error("Method not implemented.");
//   }
//   maxMarginalRelevanceSearch?(query: string, options: MaxMarginalRelevanceSearchOptions<this["FilterType"]>, callbacks: Callbacks | undefined): Promise<DocumentInterface<Record<string, any>>[]> {
//     throw new Error("Method not implemented.");
//   }
//   asRetriever(kOrFields?: number | Partial<VectorStoreRetrieverInput<this>> | undefined, filter?: this["FilterType"] | undefined, callbacks?: Callbacks | undefined, tags?: string[] | undefined, metadata?: Record<string, unknown> | undefined, verbose?: boolean | undefined): VectorStoreRetriever<this> {
//     throw new Error("Method not implemented.");
//   }
//   lc_serializable: boolean;
//   lc_kwargs;
//   lc_namespace: string[];
//   get lc_id(): string[] {
//     throw new Error("Method not implemented.");
//   }
//   get lc_secrets(): { [key: string]: string; } | undefined {
//     throw new Error("Method not implemented.");
//   }
//   get lc_attributes() {
//     throw new Error("Method not implemented.");
//   }
//   get lc_aliases(): { [key: string]: string; } | undefined {
//     throw new Error("Method not implemented.");
//   }
// }
