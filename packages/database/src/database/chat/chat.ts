import type {
  ChatSession,
  ChatSessionConfig,
  PrismaClient,
} from "@prisma/client";

export class ChatSchema_Chat {
  constructor(client: PrismaClient) {
    this.client = client;
  }
  //
  async createChat(
    userId: string,
    name: string,
    generationModelName: string,
  ): Promise<{
    chatSession: ChatSession;
    chatConfig: ChatSessionConfig;
  }> {
    return this.client.$transaction(async (prisma) => {
      const chatSession = await prisma.chatSession.create({
        data: {
          name: name,
          User: {
            connect: {
              id: userId,
            },
          },
        },
      });
      //
      const chatConfig = await prisma.chatSessionConfig.create({
        data: {
          Session: {
            connect: {
              id: chatSession.id,
            },
          },
          GenerationModel: {
            connect: {
              name: generationModelName,
            },
          },
        },
      });
      //
      return {
        chatSession: chatSession,
        chatConfig: chatConfig,
      };
    });
  }

  async getChatMemory(
    userId: string,
    chatSessionId: string,
    offset: number | undefined,
    limit: number | undefined,
  ) {
    return this.client.memory.findMany({
      select: {
        id: true,
        question: true,
        response: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        ChatSession: {
          id: chatSessionId,
          User: {
            id: userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit === undefined ? undefined : Math.min(limit, 20),
      skip: offset,
    });
  }

  async addMemory(userId: string, sessionId: string, memoryId: string) {
    return this.client.memory.update({
      where: {
        id: memoryId,
        ChatSession: {
          User: {
            id: userId,
          },
        },
      },
      data: {
        chatSessionId: sessionId,
      },
    });
  }
  //
  client: PrismaClient;
}
