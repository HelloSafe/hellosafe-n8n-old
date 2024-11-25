import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeTypeDescription,
} from "n8n-workflow";

import { loadSpeadsheetInfo } from "../../srcs/utils/accessSpreadsheet";
import { parseInputs } from "./parseInput";
import processData from "./processData";
import prepareOutput from "./prepareOutput";

export class BorderHealthInsuranceSwitzerland {

  description: INodeTypeDescription = {
    displayName: "HelloSafe Border Health Insurance Switzerland",
    name: "BorderHealthInsuranceSwitzerland",
    group: ["transform"],
    version: 1,
    description: "The Hellosafe Border Health Insurance Node for Switzerland",
    defaults: {
      name: "BorderHealthInsuranceSwitzerland",
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
    const inputs = this.getInputData()[0]?.json.body as any;
    const outputList = (this.getNodeParameter("output", 0) as string).split(
      ", "
    );
    const externalData: any = await loadSpeadsheetInfo(
      "1QbuYpRlCEk37o1nYc08rX2Na2OM3rXac6jfaQSi8sWU",
      ["prices!A:E", "codes_table!A:C", "ofsp_index!A:B"]
    );

    const parsedInputs = parseInputs(inputs);
    const processedData = processData(parsedInputs, externalData);
    const outputItems = prepareOutput(processedData, outputList);

    return this.prepareOutputData(outputItems);
  }
}
