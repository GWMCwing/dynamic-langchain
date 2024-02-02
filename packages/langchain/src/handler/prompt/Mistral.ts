import type { PlaceHolder } from "../../types/placeHolder";
import { TemplateHandler } from "./Handler";

const template =
  `<s>[INST] System Message: {system_message}\n\n{prompt} [/INST]` as const;
type MistralTemplate = typeof template;
export class MistralTemplateHandler extends TemplateHandler<MistralTemplate> {
  constructor() {
    super(template);
  }
  //
  protected applyContextPrefix(
    template: MistralTemplate,
    prefix: string,
  ): MistralTemplate {
    if (!template.includes("{context}")) {
      // if template does not have {context} placeholder
      template = template.replace(
        "{prompt}",
        "{context}\n\n{prompt}",
      ) as MistralTemplate;
    }
    return template.replace(
      "{context}",
      prefix + "{context}",
    ) as MistralTemplate;
  }
  //
  protected applyResponsePrefix(
    template: string,
    prefix: string,
  ): MistralTemplate {
    return template.replace("[/INST]", `[/INST] ${prefix}`) as MistralTemplate;
  }
  //
  protected applyContextPlaceHolder(
    template: MistralTemplate,
    placeHolderDefinition: PlaceHolder,
  ): MistralTemplate {
    const { placeHolder, placeHolderPrefix, placeHolderSuffix } =
      placeHolderDefinition;
    //
    return template.replace(
      "{context}",
      placeHolderPrefix + placeHolder + placeHolderSuffix + "\n{context}",
    ) as MistralTemplate;
  }
  protected applyPromptPrefix(
    template: MistralTemplate,
    prefix: string,
  ): MistralTemplate {
    return template.replace("{prompt}", prefix + "{prompt}") as MistralTemplate;
  }
}
