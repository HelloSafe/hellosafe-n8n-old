import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import { loadSpeadsheetInfo } from "../../srcs/utils/accessSpreadsheet";
import { parseInput } from "./parseInput";
import { prepareOutput } from "./prepareOutput";

export class MortgageCH implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Hellosafe Mortgage CH",
    name: "MortgageCH",
    group: ["transform"],
    version: 1,
    description: "The Hellosafe Mortgage CH Node",
    defaults: {
      name: "MortgageCH",
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
        required: true,
        typeOptions: {
          rows: 5,
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // Taking the input
    const inputs = this.getInputData()[0]?.json.body as any;
    const outputList = (this.getNodeParameter("output", 0) as string).split(
      ", "
    );
    const parsedInput = parseInput(inputs);

    const spreadSheet = await loadSpeadsheetInfo(
      "165q46QsJ__i43jBUn0nw3EHN4Ofrr2X-NpeMsfA2fBY",
      ["Rates!A:Z"]
    );

    const matchingRows = spreadSheet["Rates!A:Z"];
    const processedData = { ...parsedInput, matchingRows: matchingRows };
    const outputItems = prepareOutput(processedData, outputList);
    return this.prepareOutputData(outputItems);
  }
}
