import { PrismaClient } from "@prisma/client";
import { LangChainSchema } from "./langchain";
import { ChatSchema } from "./chat";
import { UserSchema } from "./user";

class Database {
  constructor() {
    this.client = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
    this.langChain = new LangChainSchema(this.client);
    this.chat = new ChatSchema(this.client);
    this.user = new UserSchema(this.client);
  }
  //
  async init() {
    await this.client.$connect();
  }
  //
  public langChain: LangChainSchema;
  public chat: ChatSchema;
  public user: UserSchema;
  //
  private client: PrismaClient;
}

let database: Database;

export async function getDatabase() {
  if (database) return database;
  database = new Database();
  await database.init();
  return database;
}
