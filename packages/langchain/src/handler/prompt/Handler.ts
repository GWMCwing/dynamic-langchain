import { PromptTemplate } from "@langchain/core/prompts";
import type { PlaceHolder, PlaceHolderQueue } from "../../types/placeHolder.js";

export type Template = `${string}{system_message}${string}{prompt}${string}`;
export type TemplateHandlerClass<T extends Template> = new (
  template: T,
) => TemplateHandler<T>;

export abstract class TemplateHandler<T extends Template> {
  constructor(template: T) {
    this.baseTemplate = template;
  }
  addContextPlaceHolder(
    placeHolder: string,
    placeHolderDefinition: Partial<PlaceHolder>,
  ): this {
    this.contextPlaceHolderQueue.set(placeHolder, {
      placeHolder: placeHolder,
      placeHolderPrefix: "",
      placeHolderSuffix: "",
      ...placeHolderDefinition,
    });
    return this;
  }
  setPromptPrefix(prefix: string): this {
    this.promptPrefix = prefix;
    return this;
  }
  setResponsePrefix(prefix: string): this {
    this.responsePrefix = prefix;
    return this;
  }
  setContextPrefix(prefix: string): this {
    this.contextPrefix = prefix;
    return this;
  }
  buildTemplate() {
    let template: T = this.baseTemplate;
    const contextPlaceHolderQueue = this.contextPlaceHolderQueue;
    const responsePrefix = this.responsePrefix;
    //
    // apply to template
    template = this.applyContextPrefix(template, this.contextPrefix);
    for (const [
      placeHolder,
      placeHolderDefinition,
    ] of contextPlaceHolderQueue) {
      template = this.applyContextPlaceHolder(template, placeHolderDefinition);
    }
    template = this.applyPromptPrefix(template, this.promptPrefix);
    template = this.applyResponsePrefix(template, responsePrefix);
    //
    return PromptTemplate.fromTemplate(template);
  }
  //
  protected abstract applyContextPrefix(template: T, prefix: string): T;
  protected abstract applyResponsePrefix(template: T, prefix: string): T;
  protected abstract applyContextPlaceHolder(
    template: T,
    placeHolderDefinition: PlaceHolder,
  ): T;
  protected abstract applyPromptPrefix(template: T, prefix: string): T;
  //
  protected baseTemplate: T;
  protected contextPlaceHolderQueue: PlaceHolderQueue = new Map();
  protected promptPrefix: string = "";
  protected contextPrefix: string = "";
  protected responsePrefix: string = "";
}
