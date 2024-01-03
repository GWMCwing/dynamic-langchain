import type { ParamsFromFString } from "@langchain/core/prompts";
import { ChatPromptTemplate, PromptTemplate } from "langchain/prompts";
import type { PlaceHolder, PlaceHolderQueue } from "../../types/placeHolder";

export abstract class TemplateHandler<Template extends string> {
  constructor(template: Template) {
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
  setResponsePrefix(prefix: string): this {
    this.responsePrefix = prefix;
    return this;
  }
  setContextPrefix(prefix: string): this {
    this.contextPrefix = prefix;
    return this;
  }
  buildTemplate() {
    let template: string = this.baseTemplate;
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
    template = this.applyResponsePrefix(template, responsePrefix);
    //
    return PromptTemplate.fromTemplate(template);
  }
  //
  protected abstract applyContextPrefix(
    template: string,
    prefix: string,
  ): string;
  protected abstract applyResponsePrefix(
    template: string,
    prefix: string,
  ): string;
  protected abstract applyContextPlaceHolder(
    template: string,
    placeHolderDefinition: PlaceHolder,
  ): string;
  //
  protected baseTemplate: Template;
  protected contextPlaceHolderQueue: PlaceHolderQueue = new Map();
  protected contextPrefix: string = "";
  protected responsePrefix: string = "";
}
