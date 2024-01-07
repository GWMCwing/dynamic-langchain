import { JSONLoader } from "langchain/document_loaders/fs/json";
import { DocumentHandler } from "./abstract/DocumentHandler";

export class JSONHandler extends DocumentHandler {
  constructor(jsonPath: string, pointers?: string | string[]) {
    const document = new JSONLoader(jsonPath, pointers);
    super(document);
  }
}
