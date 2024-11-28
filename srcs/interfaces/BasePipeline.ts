import { INodeExecutionData } from "n8n-workflow";

export default abstract class BasePipeline<
  IInputType,
  IParsedInput,
  IProcessedData
> {
  constructor() {
    if (new.target === BasePipeline) {
      throw new Error("Cannot instantiate abstract class BasePipeline directly.");
    }
  }

  abstract parseInput(input: IInputType): Promise<IParsedInput>;

  abstract processData(input: IParsedInput): Promise<IProcessedData>;

  abstract prepareOutput(
    processedData: IProcessedData,
    outputList: string[]
  ): Promise<INodeExecutionData[]>;
  abstract validate(input: any): boolean;


  async execute(
    input: any,
    outputList: string[]
  ): Promise<INodeExecutionData[]> {
    if (!this.validate(input)) {
      throw new Error("Wrong input"); 
    }
    const parsedInput = await this.parseInput(input);
    const processedData = await this.processData(parsedInput);
    const outputItems = await this.prepareOutput(processedData, outputList);
    return outputItems;
  }
}
