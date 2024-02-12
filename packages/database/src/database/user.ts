import type { PrismaClient, User, UserSession } from "@prisma/client";

export class UserSchema {
  constructor(client: PrismaClient) {
    this.client = client;
  }

  async createUser(
    name: string,
    passwordHash: string,
    salt: string,
  ): Promise<User> {
    return this.client.user.create({
      data: {
        name: name,
        passwordHash: passwordHash,
        salt: salt,
      },
    });
  }

  async getUser(name: string): Promise<User | null> {
    return this.client.user.findUnique({
      where: {
        name: name,
      },
    });
  }

  async createUserSession(userId: string): Promise<UserSession> {
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 30);
    return this.client.userSession.create({
      data: {
        expiredAt: expireDate,
        User: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async invalidateUserSession(sessionId: string): Promise<void> {
    await this.client.userSession.update({
      where: {
        id: sessionId,
      },
      data: {
        active: false,
        expiredAt: new Date(),
      },
    });
  }

  async getUserSession(
    userId: string,
    sessionId: string,
  ): Promise<UserSession | null> {
    return this.client.userSession.findUnique({
      where: {
        id: sessionId,
        userId: userId,
      },
    });
  }

  private client: PrismaClient;
}
