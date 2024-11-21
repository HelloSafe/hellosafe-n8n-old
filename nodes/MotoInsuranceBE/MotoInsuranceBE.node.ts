import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import { loadSpeadsheetInfo } from "../../srcs/utils/accessSpreadsheet";

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
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();

    const inputs = items[0]?.json.body as any;
    const json: { [key: string]: any } = {};

    const outputList = (this.getNodeParameter("output", 0) as string).split(
      ", "
    );
    const locale = inputs?.locale ?? "fr-BE";
    const type = inputs.type ?? "50 cc";

    const sheetIds: any = { "fr-BE": "price", "nl-BE": "price NL" }; //fr, nl
    const spreadSheet: any = await loadSpeadsheetInfo(
      "1Liyd4BNBtOGCDGzXRqTgCtN2DraiU4TzWa8TFsgrSWw", [sheetIds[locale]]
    );
    const priceSheetRow = spreadSheet[sheetIds[locale]];
    const headersValue = priceSheetRow[0];
    const priceList: any = priceSheetRow.filter((row: any, i: number) => {
      return row["type"] == type;
    });

    Object.entries(headersValue).forEach((offerName: any, index: number) => {
      for (let i = 0; i < outputList.length; i++) {
        const offerNameOptions = outputList[i];
        const match = offerNameOptions
          .toLocaleLowerCase()
          .replace(/\s/g, "")
          .replace(/[^a-zA-Z0-9 ]/g, "")
          .includes(
            offerName[1]
              .toLocaleLowerCase()
              .replace(/\s/g, "")
              .replace(/[^a-zA-Z0-9 ]/g, "")
          );
        if (match === true && offerNameOptions.includes("price")) {
          json[offerNameOptions] = priceList[0][offerName[1]];
          return;
        }
      }
    });

    const outputItems: INodeExecutionData[] = [];
    outputItems.push({
      json,
    });
    return this.prepareOutputData(outputItems);
  }
}
