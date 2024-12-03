import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import Pipeline from "./Pipeline";

export class DentalInsuranceBE implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Dental Insurance BE",
    name: "DentalInsuranceBE",
    group: ["transform"],
    version: 1,
    description: "The Hellosafe Dental Insurance BE Node",
    defaults: {
      name: "DentalInsuranceBE",
    },
    icon: "file:hellosafe.svg",
    inputs: ["main"],
    outputs: ["main"],
    properties: [
      {
        displayName: "OutputList",
        typeOptions: {
          rows: 5,
        },
        name: "output",
        type: "string",
        default: "",
        required: true,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const inputs = this.getInputData()[0]?.json.body as any;
    const outputList = (this.getNodeParameter("output", 0) as string).split(
      ", "
    );
    const pipeline = new Pipeline();
    const outputItems = await pipeline.execute(inputs, outputList);

    return this.prepareOutputData(outputItems);
  }
}
