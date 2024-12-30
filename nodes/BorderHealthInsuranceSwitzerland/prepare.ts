import { INodeExecutionData } from "n8n-workflow";
import IProcessedData from "./interfaces/IProcessedData";
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

export default async function prepare(
  data: IProcessedData,
  outputList: string[]
): Promise<INodeExecutionData[]> {
  const outputItems: INodeExecutionData[] = [];

  const json: { [key: string]: any } = {};

  for (let outputName of outputList) {
    if (outputName.includes("price") && !outputName.includes("priceSubtitle")) {
      const offersInfo = data.offersInfo.find((info) =>
        formalizeString(outputName).includes(info.name)
      );
      if (offersInfo) {
        json[outputName] = offersInfo.price;
      }
    }
  }

  outputItems.push({
    json,
  });

  return outputItems;
}
