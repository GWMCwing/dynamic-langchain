import type { PlaceHolder } from "../../types/placeHolder";
import { TemplateHandler } from "./Handler";

const template =
  `<s>[INST] System Message: {system_message}\n\n{prompt} [/INST]` as const;

export class MistralTemplateHandler extends TemplateHandler<typeof template> {
  constructor() {
    super(template);
  }
  //
  protected applyContextPrefix(template: string, prefix: string): string {
    if (!template.includes("{context}")) {
      // if template does not have {context} placeholder
      template = template.replace("{prompt}", "{context}\n\n{prompt}");
    }
    return template.replace("{context}", prefix + "{context}");
  }
  //
  protected applyResponsePrefix(template: string, prefix: string): string {
    return template.replace("[/INST]", `[/INST] ${prefix}`);
  }
  //
  protected applyContextPlaceHolder(
    template: string,
    placeHolderDefinition: PlaceHolder,
  ): string {
    const { placeHolder, placeHolderPrefix, placeHolderSuffix } =
      placeHolderDefinition;
    //
    return template.replace(
      "{context}",
      placeHolderPrefix + placeHolder + placeHolderSuffix + "\n{context}",
    );
  }
  protected applyPromptPrefix(template: string, prefix: string): string {
    return template.replace("{prompt}", prefix + "{prompt}");
  }
}
