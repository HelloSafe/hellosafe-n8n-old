import { INodeExecutionData } from "n8n-workflow";
import formalizeString from "../../srcs/utils/formalizeString";
import IProcessedData from "./interfaces/IProcessedData";

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

  for (let outputName of outputList) {
    const outputNameFirstPart = formalizeString(outputName).split("_")[0];
    const priceSetting = data.pricesSettings.find((pricesSetting) =>
      outputNameFirstPart.includes(formalizeString(pricesSetting.name))
    );
    if (priceSetting) {
      if (
        outputName.includes("price") &&
        !outputName.includes("priceSubtitle") &&
        formalizeString(outputName).includes(priceSetting.name)
      ) {
        json[outputName] = priceSetting.price;
      }
    }
  }

  const outputItems: INodeExecutionData[] = [];
  outputItems.push({
    json,
  });
  return outputItems;
}
