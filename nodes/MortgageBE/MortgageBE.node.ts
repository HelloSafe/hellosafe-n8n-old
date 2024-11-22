import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import { loadSpeadsheetInfo } from "../../srcs/utils/accessSpreadsheet";
import formalizeString from "../../srcs/utils/formalizeString";
import { formatDuration, getMonthly, getRate, getTotal } from "./utils";

export class MortgageBE implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Hellosafe Mortgage Rate BE",
    name: "MortgageBE",
    group: ["transform"],
    version: 1,
    description: "Get the Hellosafe Mortgage rate in Blegium Node",
    defaults: {
      name: "MortgageBE",
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
    const items = this.getInputData();
    const inputs = items[0]?.json.body as any;
    const outputList = (this.getNodeParameter("output", 0) as string).split(
      ", "
    );

    const duration = inputs.duration ?? "10";
    const amount = parseInt(inputs.amount) ?? 100000;
    const type = inputs.type ?? "Fixe";
    const country = inputs.locale == "fr-BE" ? "FR" : "NL";

    const spreadSheet = await loadSpeadsheetInfo(
      "10G1YmwdawjYjkIIPLcBFQeLPKSTPQwP2C-lskvImArc",
      ["rates_BE NEW"]
    );
    const matchingRows = spreadSheet["rates_BE NEW"].filter((row: any) => {
      return row["$duration"] === formatDuration(duration);
    });

    const json: any = {};

    matchingRows.forEach((row: any) => {
      for (let name of outputList) {
        if (
          formalizeString(name)
            .split("_")[0]
            .includes(formalizeString(row["name"]))
        ) {
          const rate = getRate(row, type);
          const total = getTotal(amount, rate ?? 1.0);
          const interest = parseFloat((total - amount).toFixed(2));
          // Price
          if (name.includes("price") && !name.includes("priceSubtitle")) {
            if (!rate) {
              json[name] = "NC";
            } else {
              json[name] =
                getMonthly(total, parseInt(duration)).toLocaleString(country, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) + " €";
            }
          } else if (name.includes("feature1")) {
            if (!rate) {
              json[name] = "NC";
            } else {
              // Interest
              json[name] = interest.toLocaleString(country) + " €";
            }
          } else if (name.includes("feature2")) {
            if (!rate) {
              json[name] = "NC";
            } else {
              // Total
              json[name] = total.toLocaleString(country) + " €";
            }
          } else if (name.includes("feature3")) {
            if (!rate) {
              json[name] = "NC";
            } else {
              // Rate
              json[name] = rate.toLocaleString(country) + " %";
            }
          }
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
