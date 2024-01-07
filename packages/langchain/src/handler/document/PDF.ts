import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DocumentHandler } from "./abstract/DocumentHandler";

type PDFLoaderPrototype = (typeof PDFLoader)["prototype"];

export type PDFLoaderOptions = {
  splitPages: PDFLoaderPrototype["splitPages"];
  parsedItemSeparator: PDFLoaderPrototype["parsedItemSeparator"];
};

export class PDFHandler extends DocumentHandler {
  constructor(pdfPath: string, options?: PDFLoaderOptions) {
    const document = new PDFLoader(pdfPath, options);
    super(document);
  }
}
