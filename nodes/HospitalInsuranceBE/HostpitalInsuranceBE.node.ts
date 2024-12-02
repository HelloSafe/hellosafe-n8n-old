import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import { loadSpeadsheetInfo } from "../../srcs/utils/accessSpreadsheet";
import Pipeline from "./Pipeline";

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
    const rawInputs = this.getInputData()[0]?.json.body as any;

    const pipeline = new Pipeline();
    const outputItems = await pipeline.execute(rawInputs, outputList);

    return this.prepareOutputData(outputItems);
  }
}
