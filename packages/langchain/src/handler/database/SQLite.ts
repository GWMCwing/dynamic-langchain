import { DataSource } from "typeorm";
import { SQLDatabaseBaseHandler } from "./abstract/DatabaseHandler.js";

export class SQLliteHandler extends SQLDatabaseBaseHandler {
  constructor(databasePath: string) {
    const dataSource = new DataSource({
      type: "sqlite",
      database: databasePath,
    });
    super(dataSource);
  }
}
