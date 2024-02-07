import type { Document, Embedding, Memory, PrismaClient } from "@prisma/client";
import { LangChainSchema_Model } from "./model.js";

export type EmbeddingInfo = {
  embedding: number[];
  modelName: string;
};

export type EmbeddingWithEmbedding = Embedding & {
  embedding: number[];
};

export class LangChainSchema {
  constructor(client: PrismaClient) {
    this.client = client;
    this._model = new LangChainSchema_Model(this.client);
  }
  //
  //
  async addDocument(
    documentInfo: Pick<Document, "name" | "localLocation" | "content">,
    userInfo: {
      userId: string;
    },
    embeddingInfo: EmbeddingInfo,
    options?: Partial<Pick<Document, "metadata" | "language" | "global">>,
  ): Promise<{
    document: Document;
    embedding: Embedding;
    contentEmbeddingTruncated: boolean;
  }> {
    return this.client.$transaction(async (prisma) => {
      const embeddingModel = await prisma.embeddingModel.findUniqueOrThrow({
        where: {
          name: embeddingInfo.modelName,
        },
      });
      //
      const contentEmbeddingTruncated =
        embeddingModel.contentLength < documentInfo.content.length;
      //
      const embeddingRow = await this.insertEmbedding(
        embeddingInfo.embedding,
        embeddingModel.id,
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
      const documentEmbedding = await prisma.documentEmbedding.create({
        data: {
          documentId: document.id,
          embeddingId: embeddingRow.id,
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
    embedding: { embedding: number[]; modelName: string },
    chatSessionId: Pick<Memory, "chatSessionId">,
  ): Promise<{
    memory: Memory;
    contentEmbeddingTruncated: boolean;
  }> {
    return this.client.$transaction(async (prisma) => {
      const embeddingModel = await prisma.embeddingModel.findUniqueOrThrow({
        where: {
          name: embedding.modelName,
        },
      });
      const contentEmbeddingTruncated =
        embeddingModel.contentLength < QA.question.length + QA.response.length;
      //
      const embeddingRow = await this.insertEmbedding(
        embedding.embedding,
        embeddingModel.id,
      );
      //
      const memory = await prisma.memory.create({
        data: {
          question: QA.question,
          response: QA.response,
          chatSessionId: chatSessionId.chatSessionId,
        },
      });

      //
      const memoryEmbedding = await prisma.memoryEmbedding.create({
        data: {
          memoryId: memory.id,
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
  async getSessionDocumentList(sessionId: string): Promise<Document[]> {
    const sessionDocuments = await this.client.document.findMany({
      where: {
        SessionDocument: {
          some: {
            chatSessionId: sessionId,
          },
        },
      },
    });
    return sessionDocuments;
  }

  async addSessionDocument(
    sessionId: string,
    documentId: string,
  ): Promise<boolean> {
    try {
      await this.client.sessionDocument.create({
        data: {
          chatSessionId: sessionId,
          documentId: documentId,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async removeSessionDocument(
    sessionId: string,
    documentId: string,
  ): Promise<boolean> {
    try {
      await this.client.sessionDocument.delete({
        where: {
          unique_session_document_document_session_id: {
            chatSessionId: sessionId,
            documentId: documentId,
          },
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
  //
  //
  async getSimilarDocuments(
    sessionId: string,
    embeddingInfo: EmbeddingInfo,
    options?: {
      limit?: number;
      similarityThreshold?: number;
    },
  ): Promise<
    Pick<Document, "id" | "name" | "content" | "metadata" | "language">[]
  > {
    const limit = options?.limit || 1;
    const similarityThreshold = options?.similarityThreshold || 0.5;
    //
    const embeddingSql = toSql(embeddingInfo.embedding);
    const similaritySql = `1 - "embedding"."embedding"::vector <=> ${embeddingSql}`;
    const documents = (await this.client.$queryRaw`
    SELECT 
      "document"."id",
      "document"."name",
      "document"."content",
      "document"."metadata",
      "document"."language",
      (${similaritySql}) AS "similarity"
    FROM "langchain"."document" AS "document"
    
    INNER JOIN "langchain"."document_embedding" AS "document_embedding"
    ON "document_embedding"."document_id" = "document"."id"

    INNER JOIN "langchain"."embedding" AS "embedding"
    ON "embedding"."id" = "document_embedding"."embedding_id"

    INNER JOIN "chat"."session_document" AS "session_document"
    ON "session_document"."document_id" = "document"."id"

    WHERE "session_document"."session_id" = '${sessionId}'

    ORDER BY "similarity" DESC
    LIMIT ${limit}
    ;
    `) as unknown as (Pick<
      Document,
      "id" | "name" | "content" | "metadata" | "language"
    > & {
      similarity: number;
    })[];
    //
    //
    return documents.filter((document) => {
      return document.similarity > similarityThreshold;
    });
  }
  //
  //
  async getSimilarMemory(
    sessionId: string,
    embeddingInfo: EmbeddingInfo,
    options?: {
      limit?: number;
      similarityThreshold?: number;
    },
  ): Promise<Pick<Memory, "id" | "question" | "response">[]> {
    const limit = options?.limit || 1;
    const similarityThreshold = options?.similarityThreshold || 0.5;
    //
    const embeddingSql = toSql(embeddingInfo.embedding);
    const similaritySql = `1 - "embedding"."embedding"::vector <=> ${embeddingSql}`;
    const memory = (await this.client.$queryRaw`
    SELECT 
      "memory"."id",
      "memory"."question",
      "memory"."response",
      (${similaritySql}) AS "similarity"
    FROM "langchain"."memory" AS "memory"

    INNER JOIN "langchain"."memory_embedding" AS "memory_embedding"
    ON "memory_embedding"."memory_id" = "memory"."id"

    INNER JOIN "langchain"."embedding" AS "embedding"
    ON "embedding"."id" = "memory_embedding"."embedding_id"

    INNER JOIN "chat"."session_memory" AS "session_memory"
    ON "session_memory"."memory_id" = "memory"."id"

    WHERE "session_memory"."session_id" = '${sessionId}'
    ORDER BY "similarity" DESC
    LIMIT ${limit}
    ;
    `) as unknown as (Pick<Memory, "id" | "question" | "response"> & {
      similarity: number;
    })[];
    //
    //
    return memory.filter((memory) => {
      return memory.similarity > similarityThreshold;
    });
  }
  //
  //
  //
  // https://github.com/pgvector/pgvector-node?tab=readme-ov-file#prisma
  private async insertEmbedding(
    embedding: number[],
    embeddingModeId: string,
  ): Promise<EmbeddingWithEmbedding> {
    const embeddingSql = toSql(embedding);
    const embeddingRow = (await this.client.$queryRawUnsafe(`
      INSERT INTO "langchain"."embedding" ("embedding", "embedding_model_id") 
      VALUES (
        '${embeddingSql}', '${embeddingModeId}'
      ) RETURNING id, embedding_model_id AS embeddingModelId, created_at AS createdAt, updated_at AS updatedAt;
      `)) as unknown as { 0: Embedding };
    const embeddingRowWithEmbedding = {
      ...embeddingRow["0"],
      embedding: embedding,
    };
    return embeddingRowWithEmbedding;
  }
  //
  //
  private _model: LangChainSchema_Model;
  get model() {
    return this._model;
  }
  private client: PrismaClient;
}

function toSql(embedding: number[]) {
  const joined = embedding.map((e) => e.toString()).join(", ");
  return `{${joined}}`;
}
