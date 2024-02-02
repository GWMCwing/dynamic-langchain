import type { ChatSessionConfig, PrismaClient } from "@prisma/client";
import type { JsonObject } from "@prisma/client/runtime/library";
import type { ChatSessionConfig_SubConfig } from "./subconfig";

export class ChatSchema_Config {
  constructor(client: PrismaClient) {
    this.client = client;
  }
  //
  async getChatSessionConfig(userId: string, sessionId: string) {
    return this.client.chatSessionConfig.findUnique({
      where: {
        chatSessionId: sessionId,
        Session: {
          User: {
            id: userId,
          },
        },
      },
    });
  }

  async updateChatSessionConfig(
    userId: string,
    sessionId: string,
    config: Partial<ChatSessionConfig_SubConfig>,
    override: false,
  ): Promise<ChatSessionConfig>;
  async updateChatSessionConfig(
    userId: string,
    sessionId: string,
    config: ChatSessionConfig_SubConfig,
    override: true,
  ): Promise<ChatSessionConfig>;
  async updateChatSessionConfig(
    userId: string,
    sessionId: string,
    config: ChatSessionConfig_SubConfig,
    override: boolean = false,
  ) {
    const currentSessionConfig = await this.getChatSessionConfig(
      userId,
      sessionId,
    );
    const currentSubConfig = currentSessionConfig?.config || {};
    const newSubConfig = override
      ? config
      : { ...(currentSubConfig as JsonObject), ...config };

    return this.client.chatSessionConfig.update({
      where: {
        id: sessionId,
        Session: {
          User: {
            id: userId,
          },
        },
      },
      data: {
        config: newSubConfig,
      },
    });
  }
  //
  private client: PrismaClient;
}
