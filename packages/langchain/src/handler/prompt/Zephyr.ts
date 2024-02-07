import { TemplateHandler } from "./Handler.js";
import type { PlaceHolder } from "../../types/placeHolder.js";

const template = `<|system|>
{system_message}</s>
<|user|>
{prompt}</s>
<|assistant|>` as const;

type ZephyrTemplate = typeof template;

export class ZephyrTemplateHandler extends TemplateHandler<ZephyrTemplate> {
  constructor() {
    super(template);
  }
  //
  protected applyContextPrefix(
    template: ZephyrTemplate,
    prefix: string,
  ): ZephyrTemplate {
    if (!template.includes("{context}")) {
      // if template does not have {context} placeholder
      template = template.replace(
        "{prompt}",
        "{context}\n\n{prompt}",
      ) as ZephyrTemplate;
    }
    return template.replace(
      "{context}",
      prefix + "{context}",
    ) as ZephyrTemplate;
  }
  //
  protected applyResponsePrefix(
    template: ZephyrTemplate,
    prefix: string,
  ): ZephyrTemplate {
    return template.replace(
      "<|assistant|>",
      `<|assistant|> ${prefix}`,
    ) as ZephyrTemplate;
  }
  //
  protected applyContextPlaceHolder(
    template: ZephyrTemplate,
    placeHolderDefinition: PlaceHolder,
  ): ZephyrTemplate {
    const { placeHolder, placeHolderPrefix, placeHolderSuffix } =
      placeHolderDefinition;
    //
    return template.replace(
      "{context}",
      placeHolderPrefix + placeHolder + placeHolderSuffix + "\n{context}",
    ) as ZephyrTemplate;
  }
  protected applyPromptPrefix(
    template: ZephyrTemplate,
    prefix: string,
  ): ZephyrTemplate {
    return template.replace("{prompt}", prefix + "{prompt}") as ZephyrTemplate;
  }
}
