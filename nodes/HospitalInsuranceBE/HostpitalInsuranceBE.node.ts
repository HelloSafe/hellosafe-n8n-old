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

export class HostpitalInsuranceBE implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Hellosafe Hospital Insurance BE",
    name: "HostpitalInsuranceBE",
    group: ["transform"],
    version: 1,
    description: "The Hellosafe Hospital Insurance BE Node",
    defaults: {
      name: "HostpitalInsuranceBE",
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
        required: true,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

    const outputList = (this.getNodeParameter("output", 0) as string).split(
      ", "
    );
    const inputs = this.getInputData()[0]?.json.body as any;

    const spreadSheet = await loadSpeadsheetInfo(
      "14GwCuDUNWbNKA2AakqMU-3u5IPxxEtT1vwIOLVxJ1CE",
      ["price_settings!A:H"]
    );

    const parsedInputs = parseInput(inputs);

    const processedData = await processData(parsedInputs, spreadSheet);

    const outputItems = prepareOutput(processedData, outputList);

    return this.prepareOutputData(outputItems);
  }
}
