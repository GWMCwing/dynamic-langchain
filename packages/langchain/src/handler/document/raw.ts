import { Document } from "langchain/document";
import { DocumentHandler } from "./abstract/DocumentHandler.js";
import type { DocumentLoader } from "langchain/document_loaders/base";
import type { TextSplitter } from "langchain/text_splitter";

class RawDocumentLoader implements DocumentLoader {
  constructor(content: string, metadata?: Record<string, unknown>) {
    this.content = content;
    this.metadata = metadata;
  }
  async load(): Promise<Document[]> {
    return [
      new Document({ pageContent: this.content, metadata: this.metadata }),
    ];
  }
  async loadAndSplit(textSplitter?: TextSplitter): Promise<Document[]> {
    const documents = await this.load();
    if (textSplitter) {
      return textSplitter.invoke(documents, {});
    }
    return documents;
  }
  protected content: string;
  protected metadata?: Record<string, unknown>;
}

export class RawContentHandler extends DocumentHandler {
  constructor(content: string, metadata?: Record<string, unknown>) {
    const document = new RawDocumentLoader(content, metadata);
    super(document);
  }
}
