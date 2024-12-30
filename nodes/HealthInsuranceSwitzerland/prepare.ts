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
  const json: { [key: string]: any } = {};
  const outputItems: INodeExecutionData[] = [];

  for (let outputName of outputList) {
    const outputNameFirstPart = formalizeString(outputName).split("_")[0];
    const priceInfo = data.offersInfo.find((offer) => {
      return formalizeString(offer.name).includes(outputNameFirstPart);
    });
    if (
      priceInfo && 
      outputName.includes("price") &&
      !outputName.includes("priceSubtitle")
    ) {
      if (data.isDollarVersion) {
        // We recall the loop for the "$" to get the number of mathcing offer
        // because it need the length of matching offer, to represent by quartile
        const offersWithPrices = outputList.filter((output: string) => {
          const outputNameFirstPart = formalizeString(output).split("_")[0];
          if (!output.includes("price") || output.includes("priceSubtitle")) {
            return false;
          }
          const price = data.offersInfo.find((offer) =>
            formalizeString(offer.name).includes(outputNameFirstPart)
          );
          if (price) {
            return true;
          }
          return false;
        });

        const sizeOfResults = offersWithPrices.length;
        const quartile = Math.floor(sizeOfResults / 4);

        const sortedOffersByPrice = [...data.offersInfo].sort((a: any, b: any) => {
          return a.price - b.price;
        });
        const index = sortedOffersByPrice.findIndex((el: any) => el === priceInfo);
        const repeatTimes = Math.floor(index / quartile) + 1;
        json[outputName] = "$".repeat(repeatTimes > 4 ? 4 : repeatTimes);
      } else {
        json[outputName] =
          priceInfo.price.toFixed(2).toString().replace(/\./g, ",") + " CHF";
      }
    }
  }
  outputItems.push({
    json,
  });
  return outputItems;
}
