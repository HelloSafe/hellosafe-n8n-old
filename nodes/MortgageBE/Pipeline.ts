import { INodeExecutionData } from "n8n-workflow";
import BasePipeline from "./BasePipeline";
import IInputType from "./IInputType";
import IParsedInput from "./IParsedInput";
import IProcessedData from "./IProcessData";
import parseInputMethod from "./parseInputMethod";
import processDataMethod from "./processDataMethod";
import prepareOutputMethod from "./prepareOutputMethod";

export default class Pipeline extends BasePipeline<
  IInputType,
  IParsedInput,
  IProcessedData
> {
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
