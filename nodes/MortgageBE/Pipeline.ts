import { INodeExecutionData } from "n8n-workflow";
import BasePipeline from "./BasePipeline";
import IInputType from "./IInputType";
import IParsedInput from "./IParsedInput";
import IProcessedData from "./IProcessData";
import parseInputMethod from "./parseInputMethod";
import processDataMethod from "./processDataMethod";
import prepareOutputMethod from "./prepareOutputMethod";
import validate from "./validate";

export default class Pipeline extends BasePipeline<
  IInputType,
  IParsedInput,
  IProcessedData
> {
  validate(input: any): boolean {
    return validate(input);
  }
  async parseInput(inputs: IInputType): Promise<IParsedInput> {
    return parseInputMethod(inputs);
  }

  async processData(input: IParsedInput): Promise<IProcessedData> {
    return processDataMethod(input);
  }

  async prepareOutput(
    processedData: IProcessedData,
    outputList: string[]
  ): Promise<INodeExecutionData[]> {
    return prepareOutputMethod(processedData, outputList);
  }
}
