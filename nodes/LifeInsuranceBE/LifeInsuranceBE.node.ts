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
        typeOptions: {
          rows: 5,
        },
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
      "1EU91lIhEdPCvQ3uI4zw2gGqswRHtTc02zX6WMlu38XY",
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

          // If c'est cas rendement de fond, dans la filterow, alors on check pour le insureur dans le name
          const matchingCondition =  row['typeEpargne'] === "Fonds épargne pension" ? formalizeString(name).includes(formalizeString(row["Assureur"])) : formalizeString(name).includes(formalizeString(row["Assureur"]) + formalizeString(row['typeEpargne']));

          console.log(row, name);
          if (matchingCondition) {
            json[name] = parseFloat(row[effiencyString].replace(',', '.')).toFixed(2).replace('.', ',') + " %";
            if (row[effiencyString] === 'NC') {
              json[name] = 'NC';
            }
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

