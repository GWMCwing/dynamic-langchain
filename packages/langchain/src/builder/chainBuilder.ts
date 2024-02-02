import type { BaseLanguageModel } from "@langchain/core/language_models/base";
import type { OutputValues } from "@langchain/core/memory";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnableSequence,
  type RunnableLike,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import type { InputValues } from "@langchain/core/utils/types";

export class RunnableSequenceBuilder<
  Input extends InputValues,
  Output_1 extends OutputValues & InputValues,
  Input_1 extends InputValues & OutputValues,
  Output extends OutputValues,
> {
  constructor(
    runnable: [
      RunnableLike<Input, Output_1>,
      ...RunnableLike<any, any>[],
      RunnableLike<any, Input_1>,
      RunnableLike<Input_1, Output>,
    ],
  );
  constructor(
    runnable: [RunnableLike<Input, Output_1>, RunnableLike<Output_1, Output>],
  );
  constructor(
    runnable: [
      RunnableLike<Input, Output_1>,
      ...RunnableLike<any, any>[],
      RunnableLike<Input_1, Output>,
    ],
  ) {
    this.chain = runnable;
  }
  //
  addTemplate<RunInput extends InputValues & Output>(
    promptTemplate: PromptTemplate<RunInput>,
  ) {
    return this.generateNewChain(promptTemplate);
  }

  addModel<
    T extends BaseLanguageModel &
      (Output extends string ? RunnableLike<Output, any> : never),
  >(model: T) {
    return this.generateNewChain(model);
  }

  build() {
    return RunnableSequence.from(this.chain);
  }

  //
  //
  //

  private generateNewChain<Output_new extends OutputValues>(
    runnableLike: RunnableLike<Output, Output_new>,
  ) {
    return new RunnableSequenceBuilder<Input, Output_1, Output, Output_new>([
      ...this.chain,
      runnableLike,
    ]);
  }

  //
  private chain: [
    RunnableLike<Input, any>,
    ...RunnableLike<any, any>[],
    RunnableLike<any, Output>,
  ];
}
/* 
new RunnableSequenceBuilder([
  RunnablePassthrough.assign<
    Record<"prefix" | "system_message" | "prompt", string>,
    Record<"prefix" | "system_message" | "prompt", string>
  >({
    prefix: async (input) => input.prefix,
    system_message: async (input) => input.system_message,
    prompt: async (input) => input.prompt,
  }),
  RunnablePassthrough.assign<
    Record<"prefix" | "system_message" | "prompt", string>,
    Record<"prefix" | "system_message" | "prompt", string>
  >({
    prefix: async (input) => input.prefix,
    system_message: async (input) => input.system_message,
    prompt: async (input) => input.prompt,
  }),
]).addTemplate(
  PromptTemplate.fromTemplate(`{prefix}\n{system_message}\n{prompt}`),
);
 */
