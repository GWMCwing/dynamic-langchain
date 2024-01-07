import type { DocumentLoader } from "langchain/document_loaders/base";

export abstract class DocumentHandler {
  constructor(document: DocumentLoader) {
    this.document = document;
  }
  getDocument() {
    return this.document;
  }
  protected document: DocumentLoader;
}
