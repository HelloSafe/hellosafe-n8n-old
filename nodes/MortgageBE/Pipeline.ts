import { INodeExecutionData } from "n8n-workflow";
import { loadSpeadsheetInfo } from "../../srcs/utils/accessSpreadsheet";
import BasePipeline from "./BasePipeline";
import { formatDuration, getMonthly, getRate, getTotal } from "./utils";
import formalizeString from "../../srcs/utils/formalizeString";

interface IInputType {
  duration: string;
  amount: string;
  type: string;
  locale: string;
}

interface IParsedInput {
  duration: string;
  amount: number;
  type: string;
  country: string;
}

interface IProcessedData {
    originalInput: IParsedInput;
    matchingRows: any[];
}

export default class Pipeline extends BasePipeline<
  IInputType,
  IParsedInput,
  IProcessedData
> {
  async parseInput(inputs: IInputType): Promise<IParsedInput> {
    const duration = inputs.duration ?? "10";
    const amount = parseInt(inputs.amount) ?? 100000;
    const type = inputs.type ?? "Fixe";
    const country = inputs.locale == "fr-BE" ? "FR" : "NL";

    return {
      duration: duration,
      amount: amount,
      type: type,
      country: country,
    };
  }
  async processData(input: IParsedInput): Promise<IProcessedData> {
    const spreadSheet = await loadSpeadsheetInfo(
      "10G1YmwdawjYjkIIPLcBFQeLPKSTPQwP2C-lskvImArc",
      ["rates_BE NEW!A:E"]
    );
    const matchingRows = spreadSheet["rates_BE NEW!A:E"].filter((row: any) => {
        return row["$duration"] === formatDuration(input.duration);
      });
      return {
        originalInput: input,
        matchingRows: matchingRows,
      }
  }
  async prepareOutput(
    processedData: IProcessedData,
    outputList: string[]
  ): Promise<INodeExecutionData[]> {
    const json: any = {};

    // Get the column values in Gsheet for each offer
    processedData.matchingRows.forEach((row: any) => {
      for (let name of outputList) {
        if (
          formalizeString(name)
            .split("_")[0]
            .includes(formalizeString(row["name"]))
        ) {
          const rate = getRate(row, processedData.originalInput.type);
          const total = getTotal(processedData.originalInput.amount, rate ?? 1.0);
          const interest = parseFloat((total - processedData.originalInput.amount).toFixed(2));
          // Price
          if (name.includes("price") && !name.includes("priceSubtitle")) {
            if (!rate) {
              json[name] = "NC";
            } else {
              json[name] =
                getMonthly(
                  total,
                  parseInt(processedData.originalInput.duration)
                ).toLocaleString(processedData.originalInput.country, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) + " €";
            }
          } else if (name.includes("feature1")) {
            if (!rate) {
              json[name] = "NC";
            } else {
              // Interest
              json[name] = interest.toLocaleString(processedData.originalInput.country) + " €";
            }
          } else if (name.includes("feature2")) {
            if (!rate) {
              json[name] = "NC";
            } else {
              // Total
              json[name] = total.toLocaleString(processedData.originalInput.country) + " €";
            }
          } else if (name.includes("feature3")) {
            if (!rate) {
              json[name] = "NC";
            } else {
              // Rate
              json[name] = rate.toLocaleString(processedData.originalInput.country) + " %";
            }
          }
        }
      }
    });
  
    const outputItems: INodeExecutionData[] = [];
    outputItems.push({
      json,
    });
    return outputItems;
  }
}
