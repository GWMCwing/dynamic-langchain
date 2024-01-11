import { PrismaClient } from "@prisma/client";
import LangChainSchema from "./langchain";

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
  }
  async init() {
    await this.client.$connect();
  }
  public langChain: LangChainSchema;
  //
  private client: PrismaClient;
}

let database: Database;

export async function getDatabase() {
  if (database) return database;
  database = new Database();
  await database.init();
}
