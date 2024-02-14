import type { PrismaClient } from "@prisma/client";

export class ChatSchema_Session {
  constructor(client: PrismaClient) {
    this.client = client;
  }
  //

  async getChatSessionList(
    userId: string,
    limit: number = 10,
    skip: number = 0,
  ) {
    return this.client.chatSession.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        //
        ChatSessionConfig: {
          include: {
            GenerationModel: {
              select: {
                name: true,
              },
            },
          },
        },
        //
        Memory: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      where: {
        User: {
          id: userId,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: skip,
      take: limit,
    });
  }

  async getChatSession(
    userId: string,
    sessionId: string,
    offset: number | undefined = undefined,
    limit: number | undefined = undefined,
  ) {
    return this.client.chatSession.findUnique({
      where: {
        id: sessionId,
        User: {
          id: userId,
        },
      },
      include: {
        ChatSessionConfig: true,
        Memory: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10 || limit,
          skip: offset,
        },
        SessionDocument: {
          orderBy: {
            Document: {
              createdAt: "desc",
            },
          },
          include: {
            Document: {
              select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                language: true,
                metadata: true,
              },
            },
          },
        },
      },
    });
  }

  async chatSessionExists(userId: string, name: string) {
    const result = await this.client.chatSession.findUnique({
      where: {
        unique_user_name: {
          userId: userId,
          name: name,
        },
      },
    });
    return result !== null;
  }
  //
  private client: PrismaClient;
}
