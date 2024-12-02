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
export default async function prepare(
  data: IProcessedData,
  outputList: string[]
): Promise<INodeExecutionData[]> {
  const json: any = {};

  for (let name of outputList) {
    // To only fill the price corresponding result
    if (name.includes("price") && !name.includes("priceSubtitle")) {
      // The matching current offer with the corresponding row in the sheet
      const priceSetting = data.priceSettings.find((row) =>
        formalizeString(name).includes(
          formalizeString(row.insurance + row.formula)
        )
      );
      if (priceSetting) {
        json[name] = priceSetting.price;
      }
    }
  }

  return [{ json }];
}
