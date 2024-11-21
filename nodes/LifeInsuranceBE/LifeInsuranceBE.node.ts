import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import { loadSpeadsheetInfo } from "../../srcs/utils/accessSpreadsheet";
import formalizeString from "../../srcs/utils/formalizeString";
import {
  frEfficiencyString,
  frEpargnType,
  nlEfficiencyString,
  nlEpargnType,
} from "./utils";

export class LifeInsuranceBE implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Hellosafe Life Insurance BE",
    name: "LifeInsuranceBE",
    group: ["transform"],
    version: 1,
    description: "The Hellosafe Life Insurance BE Node",
    defaults: {
      name: "LifeInsuranceBE",
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
    const inputs = items[0]?.json.body as any;

    const outputList = (this.getNodeParameter("output", 0) as string).split(
      ", "
    );

    let epargneType = inputs.typeEpargne ?? "Rendement moyen sur 5 ans";
    let effiencyString = inputs.efficiencyRate ?? "Epargne pension";
    let branch: number = 0;

    // Get the branch number if it is
    if (epargneType.includes("Branche") || epargneType.includes("Tak")) {
      branch = parseInt(epargneType.match(/[0-9]+/));
    }

    // Translate columnName to french if it's dutch
    if (nlEpargnType.includes(inputs.typeEpargne)) {
      const idxEpargne = nlEpargnType.indexOf(inputs.typeEpargne);
      epargneType = frEpargnType[idxEpargne];
      const idxEfficiency = nlEfficiencyString.indexOf(inputs.efficiencyRate);
      effiencyString = frEfficiencyString[idxEfficiency];
    }

    const spreadSheet = await loadSpeadsheetInfo(
      "1wKzpc9UgEsYviU3WjmhOzbi-CDZWPuhVGTHOZYmeDkc",
      ["Rendements"]
    );

    const filteredRows = spreadSheet["Rendements"].filter((row: any) => {
      if (branch > 0) {
        return row["branch"]?.search(branch.toString()) > -1;
      } else {
        return row["typeEpargne"] === epargneType;
      }
    });

    const json: any = {};

    console.log(filteredRows);
    for (let name of outputList) {
      if (name.includes("price") && !name.includes("priceSubtitle")) {
        filteredRows.forEach((row: any) => {
          console.log(
            formalizeString(name),
            formalizeString(row["Assureur"]),
            formalizeString(name).includes(formalizeString(row["Assureur"]))
          );
          if (
            formalizeString(name).includes(formalizeString(row["Assureur"])) &&
            // to avoid replace when value when they have the same name " part of it"
            json[name] === undefined
          ) {
            json[name] = row[effiencyString];
          }
        });
      }
    }

    const outputItems: INodeExecutionData[] = [];
    outputItems.push({
      json,
    });

    return this.prepareOutputData(outputItems);
  }
}
