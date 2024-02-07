import { DataSource } from "typeorm";
import { SQLDatabaseBaseHandler } from "./abstract/DatabaseHandler.js";

export class PGHandler extends SQLDatabaseBaseHandler {
  constructor(
    host: string,
    port: number,
    username: string,
    password: string,
    database: string,
  );
  constructor(connectionString: string);
  constructor(
    hostOrConnectionString: string,
    port?: number,
    username?: string,
    password?: string,
    database?: string,
  ) {
    const dataSource = new DataSource({
      type: "postgres",
      host: hostOrConnectionString,
      port: port,
      username: username,
      password: password,
      database: database,
    });
    super(dataSource);
  }
}
