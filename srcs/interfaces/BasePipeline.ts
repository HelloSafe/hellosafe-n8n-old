import { INodeExecutionData } from "n8n-workflow";

export default abstract class BasePipeline<
  IInput,
  IOutput
> {
  constructor() {
    if (new.target === BasePipeline) {
      throw new Error("Cannot instantiate abstract class BasePipeline directly.");
    }
  }

  abstract parse(input: any): Promise<IInput>;

  abstract process(input: IInput): Promise<IOutput>;

  abstract prepare(
    output: IOutput,
    outputList: string[]
  ): Promise<INodeExecutionData[]>;
  abstract validate(input: any): boolean;


  async execute(
    rawInput: any,
    outputList: string[]
  ): Promise<INodeExecutionData[]> {
    const input = await this.parse(rawInput);
    if (!this.validate(input)) {
      throw new Error("Invalid input");
    }
    const output = await this.process(input);
    const outputItems = await this.prepare(output, outputList);
    return outputItems;
  }
}
