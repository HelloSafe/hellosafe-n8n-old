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

export class MotoInsuranceBE implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Hellosafe Moto Insurance BE",
    name: "motoInsuranceBE",
    icon: "file:hellosafe.svg",
    group: ["transform"],
    version: 1,
    description: "Workflow of Moto Insurance in Belgium ",
    defaults: {
      name: "Moto Insurance BE",
    },
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
    const inputs = this.getInputData()[0]?.json.body as any;

    const outputList = (this.getNodeParameter("output", 0) as string).split(
      ", "
    );

    const parsedInput = parseInput(inputs);

    const spreadSheet: any = await loadSpeadsheetInfo(
      "1Liyd4BNBtOGCDGzXRqTgCtN2DraiU4TzWa8TFsgrSWw",
      [`${parsedInput.sheetIds[parsedInput.locale]}!A:AA`]
    );
    const processedData = processData(parsedInput, spreadSheet);

    const outputItems = prepareOutput(processedData, outputList);

    return this.prepareOutputData(outputItems);
  }
}
