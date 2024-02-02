import type { PrismaClient, User } from "@prisma/client";

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

  private client: PrismaClient;
}
