import { INodeExecutionData } from "n8n-workflow";
import IProcessedData from "./interface/IProcessedData";
import formalizeString from "../../srcs/utils/formalizeString";
/**
 * Prepares localized output data from processed rate settings.
 *
 * This function translates numeric values from the processed data into a
 * localized and formatted structure based on the provided output list. It
 * matches output names with corresponding rate settings and formats their
 * values (e.g., monthly payments, interest, total, rates) into the desired
 * localized representation.
 *
 * @param data - The processed data containing rate settings and language information.
 * @param outputList - An array of output names indicating the desired outputs to generate.
 * @returns A promise that resolves to an array of localized execution data objects.
 */
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
          json[outputName] = rateSetting.rate;
        } else if (outputName.includes("feature2")) {
          // Monthly
          json[outputName] = rateSetting.monthly;
        } else if (outputName.includes("feature3")) {
          // Interest
          json[outputName] = rateSetting.interest;
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
