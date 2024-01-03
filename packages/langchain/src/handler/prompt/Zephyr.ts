import { TemplateHandler } from "./Handler";
import type { PlaceHolder } from "../../types/placeHolder";

const template = `<|system|>
{system_message}</s>
<|user|>
{prompt}</s>
<|assistant|>` as const;

export class ZephyrTemplateHandler extends TemplateHandler<typeof template> {
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
    return template.replace("<|assistant|>", `<|assistant|>${prefix}`);
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
}
