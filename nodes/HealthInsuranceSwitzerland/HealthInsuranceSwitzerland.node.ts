import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import Pipeline from "./Pipeline";

export class HealthInsuranceSwitzerland implements INodeType {
  description: INodeTypeDescription = {
    displayName: "HelloSafe's HealthInsuranceSwitzerland",
    name: "healthInsuranceSwitzerland",
    group: ["transform"],
    version: 1,
    description: "HealthInsuranceSwitzerland Node",
    defaults: {
      name: "HealthInsuranceSwitzerland",
    },
    icon: "file:hellosafe.svg",
    inputs: ["main"],
    outputs: ["main"],
    properties: [
      {
        displayName: "OutputList",
        name: "output",
        type: "string",
        typeOptions: {
          rows: 5,
        },
        // to reset to ""
        default: "",
        required: true,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // We get the inputs and set in the good format
    const rawInputs = this.getInputData()[0]?.json.body as any;
    const outputList = (this.getNodeParameter("output", 0) as string).split(
      ", "
    );

    const pipeline = new Pipeline();
    const outputItems = await pipeline.execute(rawInputs, outputList);

    return this.prepareOutputData(outputItems);
  }
}
