import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";

import {
  accessSpreadsheet,
  find_ofsp_match,
  find_region_code,
  get_price,
  outputList,
  settings,
} from "./utils";

export class BorderHealthInsuranceSwitzerland implements INodeType {
  description: INodeTypeDescription = {
    displayName: "HelloSafe Border Health Insurance",
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
    properties: [],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const inputs = items[0]?.json.body as any;
    const locale = inputs?.locale ?? "fr-CH";
    const language = locale.split("-")[0];

    const age: any =
      inputs?.age ?? (settings as any)?.ageSelections[language][0];
    const indexOfAge = (settings as any)?.ageSelections[language].indexOf(age);
    let ageCode = settings.ageCodesCorrespondingToAgeSelections[1];
    if (indexOfAge !== -1) {
      ageCode = settings.ageCodesCorrespondingToAgeSelections[indexOfAge];
    }

    let coverCode = "OHN-UNF";
    if (inputs?.accidentCover == "true") {
      coverCode = "MIT-UNF";
    }
    const location =
      inputs?.location ?? "";

    const outputItems: INodeExecutionData[] = [];

    const spreadSheet = await accessSpreadsheet();

    const codesTable = spreadSheet.sheetsById[1544244057];
    const codesTableRows = await codesTable.getRows();

    const location_code = find_region_code(location, codesTableRows)

    const ofsp_code_sheet = spreadSheet.sheetsById[1984756530];
    const ofsp_code_raw = await ofsp_code_sheet.getRows();

    

    const json: { [key: string]: any } = {};

    for (let name of outputList) {
      if (name.includes("price") && !name.includes("priceSubtitle")) {
        let index_info = find_ofsp_match(name, ofsp_code_raw);
        if (index_info.code != 0) {
          const price_sheet =  spreadSheet.sheetsById[1074982097];
          const price_sheet_rows = await price_sheet.getRows();
          json[name] = get_price(index_info.code, location_code, coverCode, ageCode, price_sheet_rows);
        }
      }
    }
    outputItems.push({
      json,
    });

    return this.prepareOutputData(outputItems);
  }
}
