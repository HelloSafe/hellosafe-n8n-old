import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import { loadSpeadsheetInfo } from "../../srcs/utils/accessSpreadsheet";
import { parseInput } from "./parseInput";
import { processData } from "./processData";
import { prepareOutput } from "./prepareOutput";

export class MortgageBE implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Hellosafe Mortgage Rate BE",
    name: "MortgageBE",
    group: ["transform"],
    version: 1,
    description: "Get the Hellosafe Mortgage rate in Blegium Node",
    defaults: {
      name: "MortgageBE",
    },
    icon: "file:hellosafe.svg",
    inputs: ["main"],
    outputs: ["main"],
    properties: [
      {
        displayName: "OutputList",
        name: "output",
        type: "string",
        default: "",
        typeOptions: {
          rows: 5,
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // We get the inputs and set in the good format
    const inputs = this.getInputData()[0]?.json.body as any;
    const outputList = (this.getNodeParameter("output", 0) as string).split(
      ", "
    );

    const spreadSheet = await loadSpeadsheetInfo(
      "10G1YmwdawjYjkIIPLcBFQeLPKSTPQwP2C-lskvImArc",
      ["rates_BE NEW!A:E"]
    );

    const parsedInput = parseInput(inputs);
    const processedData = processData(parsedInput, spreadSheet);
    console.log(processedData);
    const outputItems = prepareOutput(processedData, outputList);

    return this.prepareOutputData(outputItems);
  }
}
