import { INodeExecutionData } from "n8n-workflow";
import IProcessedData from "./IProcessData";
import formalizeString from "../../srcs/utils/formalizeString";
import { getMonthly, getRate, getTotal } from "./utils";

export default async function prepareOutputMethod(
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
        const interest = parseFloat(
          (total - processedData.originalInput.amount).toFixed(2)
        );
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
            json[name] =
              interest.toLocaleString(processedData.originalInput.country) +
              " €";
          }
        } else if (name.includes("feature2")) {
          if (!rate) {
            json[name] = "NC";
          } else {
            // Total
            json[name] =
              total.toLocaleString(processedData.originalInput.country) + " €";
          }
        } else if (name.includes("feature3")) {
          if (!rate) {
            json[name] = "NC";
          } else {
            // Rate
            json[name] =
              rate.toLocaleString(processedData.originalInput.country) + " %";
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
