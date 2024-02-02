import type { PrismaClient } from "@prisma/client";

export class LangChainSchema_Model {
  constructor(client: PrismaClient) {
    this.client = client;
  }
  //
  async getEmbeddingModel(id: string) {
    return this.client.embeddingModel.findUnique({
      where: {
        id: id,
      },
    });
  }
  async getGenerationModel(id: string) {
    return this.client.generationModel.findUnique({
      where: {
        id: id,
      },
    });
  }
  //
  async addOrActivateEmbeddingModel(
    name: string,
    contentLength: number,
    dimension: number,
  ) {
    return this.client.embeddingModel.upsert({
      create: {
        name: name,
        active: true,
        dimension: dimension,
        contentLength: contentLength,
      },
      update: {
        active: true,
      },
      where: {
        name: name,
      },
    });
  }
  //
  async disableEmbeddingModel(name: string) {
    return this.client.embeddingModel.update({
      data: {
        active: false,
      },
      where: {
        name: name,
      },
    });
  }
  //
  async disableAllEmbeddingModels() {
    return this.client.embeddingModel.updateMany({
      data: {
        active: false,
      },
    });
  }
  //
  //

  async addOrActivateGenerationModel(name: string) {
    return this.client.generationModel.upsert({
      create: {
        name: name,
        active: true,
      },
      update: {
        active: true,
      },
      where: {
        name: name,
      },
    });
  }
  //
  async disableGenerationModel(name: string) {
    return this.client.generationModel.update({
      data: {
        active: false,
      },
      where: {
        name: name,
      },
    });
  }
  //
  async disableAllGenerationModels() {
    return this.client.generationModel.updateMany({
      data: {
        active: false,
      },
    });
  }
  //
  //
  private client: PrismaClient;
}
