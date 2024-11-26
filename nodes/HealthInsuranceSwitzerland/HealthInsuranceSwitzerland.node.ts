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
    const outputList = (this.getNodeParameter("output", 0) as string).split(
      ", "
    );
    const inputs = this.getInputData()[0]?.json.body as any;

    let spreadSheet = await loadSpeadsheetInfo(
      "1mHOPog6kosRTqRwkCjOiY1xGrcr_QLZRTdFLh1a4Xmo",
      ["postal!A:C", "ofsp_index_2025!A:D"]
    );

    const parsedInputs = parseInput(inputs);

    const processedData = await processData(parsedInputs, spreadSheet);

    const outputItems = prepareOutput(processedData, outputList);

    return this.prepareOutputData(outputItems);
  }
}
