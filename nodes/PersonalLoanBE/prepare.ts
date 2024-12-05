import { INodeExecutionData } from "n8n-workflow";
import IProcessedData from "./interface/IProcessedData";
import formalizeString from "../../srcs/utils/formalizeString";

export async function prepare(
  data: IProcessedData,
  outputList: string[]
): Promise<INodeExecutionData[]> {
  const json: any = {};

  // We loop on the offer, to fill parameters
  for (let outputName of outputList) {
    const outputNameFirstPart = formalizeString(outputName).split("_")[0];
    const rateSetting = data.rateSettings.find((rateSetting) =>
      outputNameFirstPart.includes(formalizeString(rateSetting.name))
    );
    if (rateSetting) {
      if (
        outputName
          .toLocaleLowerCase()
          .replace(/\s/g, "")
          .includes(rateSetting.name.toLocaleLowerCase().replace(/\s/g, ""))
      ) {
        if (outputName.includes("feature1")) {
          // Rate
          json[outputName] = (rateSetting.rate * 100).toFixed(2) + " %";
        } else if (outputName.includes("feature2")) {
          // Monthly
          json[outputName] = parseFloat(rateSetting.monthly.toFixed(2)) + " €";
        } else if (outputName.includes("feature3")) {
          // Interest
          json[outputName] = parseFloat(rateSetting.interest.toFixed(2)) + " €";
        }
      }
    }
  }
  const outputItems: INodeExecutionData[] = [];

  outputItems.push({
    json,
  });
  return outputItems;
}
