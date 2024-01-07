import {
  SqlDatabase,
  type SqlDatabaseDataSourceParams,
} from "langchain/sql_db";
import { DataSource } from "typeorm";

abstract class DatabaseHandler {
  abstract getDataSource(): DataSource;
  abstract getDataBase(): Promise<SqlDatabase>;
  abstract setSourceParams(param: SqlDatabaseDataSourceParams): void;
}

export abstract class SQLDatabaseBaseHandler extends DatabaseHandler {
  constructor(dataSource: DataSource) {
    super();
    this.dataSource = dataSource;
    this.databaseSourceParams = { appDataSource: this.dataSource };
  }
  setSourceParams(
    param: Pick<
      SqlDatabaseDataSourceParams,
      | "customDescription"
      | "ignoreTables"
      | "includesTables"
      | "sampleRowsInTableInfo"
    >,
  ) {
    this.databaseSourceParams = { ...this.databaseSourceParams, ...param };
  }

  async getDataBase() {
    return await SqlDatabase.fromDataSourceParams({
      appDataSource: this.dataSource,
    });
  }

  getDataSource = () => this.dataSource;

  protected dataSource: DataSource;
  protected databaseSourceParams: SqlDatabaseDataSourceParams;
}

export type { DatabaseHandler };
