import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { DocumentHandler } from "./abstract/DocumentHandler.js";

export type CSVLoaderOptions = (typeof CSVLoader)["prototype"]["options"];

export class CSVHandler extends DocumentHandler {
  constructor(csvPath: string, options?: CSVLoaderOptions) {
    const document = new CSVLoader(csvPath, options);
    super(document);
  }
}
