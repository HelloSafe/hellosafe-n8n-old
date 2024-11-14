import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import { accessSpreadsheet, outputList } from "./utils";
import { GoogleSpreadsheetRow } from "google-spreadsheet";

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
    properties: [],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();

    const inputs = items[0]?.json.body as any;
    const json: { [key: string]: any } = {};

    const locale = inputs?.locale ?? "fr-BE";
    const type = inputs.type ?? "50 cc";

    const sheetIds: any = { "fr-BE": 412984700, "nl-BE": 1294185195 }; //fr, nl
    let spreadSheet = await accessSpreadsheet();
    const priceSheet = spreadSheet.sheetsById[sheetIds[locale]];
    await priceSheet.loadHeaderRow(1);
    const headervalue = priceSheet.headerValues;
    const priceSheetRow = await priceSheet.getRows();
    const priceList: GoogleSpreadsheetRow<Record<string, any>>[] =
      priceSheetRow.filter((row, i) => {
        return row.get("type") == type;
      });

    headervalue.forEach((offerName, index) => {
      for (let i = 0; i < outputList.length; i++) {
        const offerNameOptions = outputList[i];
        console.log(offerNameOptions);
        const match = offerNameOptions
          .toLocaleLowerCase()
          .replace(/\s/g, "").replace(/[^a-zA-Z0-9 ]/g, '')
          .includes(offerName.toLocaleLowerCase().replace(/\s/g, "").replace(/[^a-zA-Z0-9 ]/g, ''));
        if (match === true && offerNameOptions.includes("price")) {
          json[offerNameOptions] = priceList[0].get(offerName);
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
