import type { PrismaClient } from "@prisma/client";
import { ChatSchema_Chat } from "./chat.js";
import { ChatSchema_Session } from "./session.js";
import { ChatSchema_Config } from "./config.js";

export class ChatSchema {
  constructor(client: PrismaClient) {
    this.client = client;
    this._chat = new ChatSchema_Chat(this.client);
    this._session = new ChatSchema_Session(this.client);
    this._config = new ChatSchema_Config(this.client);
  }
  //
  get chat(): ChatSchema_Chat {
    return this._chat;
  }
  get session(): ChatSchema_Session {
    return this._session;
  }
  get config(): ChatSchema_Config {
    return this._config;
  }
  //
  private _chat: ChatSchema_Chat;
  private _session: ChatSchema_Session;
  private _config: ChatSchema_Config;
  private client: PrismaClient;
}
