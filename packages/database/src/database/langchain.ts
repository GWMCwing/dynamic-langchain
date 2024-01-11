import type { Document, Embedding, Memory, PrismaClient } from "@prisma/client";
import { toSql } from "pgvector/pg";

class LangChainSchema {
  constructor(client: PrismaClient) {
    this.client = client;
  }
  //
  //
  async addDocument(
    documentInfo: Pick<Document, "name" | "localLocation" | "content">,
    userInfo: {
      userId: string;
    },
    embedding: Pick<Embedding, "embeddingModelId"> & {
      embedding: number[];
    },
    options?: Partial<Pick<Document, "metadata" | "language" | "global">>,
  ): Promise<{
    document: Document;
    embedding: Embedding;
    contentEmbeddingTruncated: boolean;
  }> {
    return this.client.$transaction(async (prisma) => {
      const embeddingModel = await prisma.embeddingModel.findUniqueOrThrow({
        where: {
          id: embedding.embeddingModelId,
        },
      });
      const contentEmbeddingTruncated =
        embeddingModel.contentLength < documentInfo.content.length;
      //
      const embeddingRow = await this.insertEmbedding(
        embedding.embedding,
        embedding.embeddingModelId,
      );
      //
      const document = await prisma.document.create({
        data: {
          name: documentInfo.name,
          localLocation: documentInfo.localLocation,
          content: documentInfo.content,
          metadata: options?.metadata || {},
          language: options?.language,
          global: options?.global,
          User: {
            connect: {
              id: userInfo.userId,
            },
          },
        },
      });
      //
      return {
        document: document,
        embedding: embeddingRow,
        contentEmbeddingTruncated: contentEmbeddingTruncated,
      };
    });
  }
  //
  //
  async addMemory(
    QA: Pick<Memory, "question" | "response">,
    embedding: Pick<Embedding, "embeddingModelId"> & { embedding: number[] },
    chatSessionId: Pick<Memory, "chatSessionId">,
  ): Promise<{
    memory: Memory;
    contentEmbeddingTruncated: boolean;
  }> {
    return this.client.$transaction(async (prisma) => {
      const embeddingModel = await prisma.embeddingModel.findUniqueOrThrow({
        where: {
          id: embedding.embeddingModelId,
        },
      });
      const contentEmbeddingTruncated =
        embeddingModel.contentLength < QA.question.length + QA.response.length;
      //
      const embeddingRow = await this.insertEmbedding(
        embedding.embedding,
        embedding.embeddingModelId,
      );
      //
      const memory = await prisma.memory.create({
        data: {
          question: QA.question,
          response: QA.response,
          chatSessionId: chatSessionId.chatSessionId,
          embeddingId: embeddingRow.id,
        },
      });
      //
      return {
        memory: memory,
        contentEmbeddingTruncated: contentEmbeddingTruncated,
      };
    });
  }
  //
  //
  // https://github.com/pgvector/pgvector-node?tab=readme-ov-file#prisma
  private async insertEmbedding(
    embedding: number[],
    embeddingModeId: string,
  ): Promise<Embedding> {
    const embeddingSql = toSql(embedding);
    const lossyRawEmbedding = `{${embedding.join(",")}}`;
    const embeddingRow = (await this.client.$executeRaw`
      INSERT INTO Embedding ("embedding", "lossy_raw_embedding", "embedding_model_id") 
      VALUES (
        ${embeddingSql}::vector, ${lossyRawEmbedding}, ${embeddingModeId}
      ) RETURNING *`) as unknown as Embedding;
    return embeddingRow;
  }
  //
  //
  private client: PrismaClient;
}

export default LangChainSchema;
