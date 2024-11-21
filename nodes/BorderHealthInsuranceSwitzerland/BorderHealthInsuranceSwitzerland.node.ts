import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";

import { findOfspMatch, findRegionCode, getPrice, settings } from "./utils";
import { loadSpeadsheetInfo } from "../../srcs/utils/accessSpreadsheet";

export class BorderHealthInsuranceSwitzerland implements INodeType {
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
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const outputList = (this.getNodeParameter("output", 0) as string).split(
      ", "
    );
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
    const location = inputs?.location ?? "";

    const outputItems: INodeExecutionData[] = [];

    const sheets: any = await loadSpeadsheetInfo(
      "1QbuYpRlCEk37o1nYc08rX2Na2OM3rXac6jfaQSi8sWU",
      ["prices", "codes_table", "ofsp_index"]
    );
    const locationCode = findRegionCode(location, sheets["codes_table"]);

    const json: { [key: string]: any } = {};

    for (let name of outputList) {
      if (name.includes("price") && !name.includes("priceSubtitle")) {
        let indexInfo = findOfspMatch(name, sheets["ofsp_index"]);
        if (indexInfo.code != 0) {
          json[name] = getPrice(
            indexInfo.code,
            locationCode,
            coverCode,
            ageCode,
            sheets["prices"]
          );
        }
      }
    }
    outputItems.push({
      json,
    });

    return this.prepareOutputData(outputItems);
  }
}
