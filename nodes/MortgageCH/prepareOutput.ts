import { INodeExecutionData } from "n8n-workflow";
import formalizeString from "../../srcs/utils/formalizeString";
import { getMonthly, getRate, getTotal, roundToNearest05 } from "./utils";

export function prepareOutput(processedData: any, outputList: any) {
  const json: any = {};

  // Loop on the matching row, to fill offersInput
  processedData.matchingRows.forEach((row: any) => {
    for (let name of outputList) {
      if (
        formalizeString(name)
          .split("_")[0]
          .includes(formalizeString(row["Bank"]))
      ) {
        const rate = getRate(row, processedData.duration.toString());
        const total = getTotal(processedData.amount, rate ?? 1.0);
        const interest = parseFloat((total - processedData.amount).toFixed(2));
        // Price
        if (name.includes("price") && !name.includes("priceSubtitle")) {
          if (!rate) {
            json[name] = "NC";
          } else {
            json[name] = getMonthly(total, parseInt(processedData.duration)) + " CHF";
          }
        } else if (name.includes("feature1")) {
          if (!rate) {
            json[name] = "NC";
          } else {
            // Interest
            json[name] = roundToNearest05(interest) + " CHF";
          }
        } else if (name.includes("feature2")) {
          if (!rate) {
            json[name] = "NC";
          } else {
            // Total
            json[name] = roundToNearest05(total) + " CHF";
          }
        } else if (name.includes("feature3")) {
          if (!rate) {
            json[name] = "NC";
          } else {
            // Rate
            json[name] = rate.toString().replace(".", ",") + " %";
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