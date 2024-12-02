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

import { INodeExecutionData } from "n8n-workflow";
import IProcessedData from "./interface/IProcessData";
import formalizeString from "../../srcs/utils/formalizeString";

export default async function prepare(
  data: IProcessedData,
  outputList: string[]
): Promise<INodeExecutionData[]> {
  const json: any = {};

  data.pricesRows.forEach((row: any) => {
    for (let outputName of outputList) {
      const outputNameFirstPart = formalizeString(outputName).split("_")[0];
      const priceSettings = data.pricesRows.find((row) =>
        outputNameFirstPart.includes(
          formalizeString(row.name + row.logoSubtitle)
        )
      );
      if (priceSettings) {
        if (
          outputName.includes("price") &&
          !outputName.includes("priceSubtitle")
        ) {
          // Comparing if the price is the lowest or not

          if (json[outputName] != undefined) {
            let val1 = parseFloat(json[outputName].replace(/,/g, ".")).toFixed(
              2
            );
            let val2 = parseFloat(
              priceSettings.price.replace(/,/g, ".")
            ).toFixed(2);
            if (val2 < val1) {
              json[outputName] =
                parseFloat(row["price"].replace(/,/g, "."))
                  .toFixed(2)
                  .toString()
                  .replace(/\./g, ",") + " €";
            }
          } else {
            json[outputName] =
              parseFloat(priceSettings.price.replace(/,/g, "."))
                .toFixed(2)
                .toString()
                .replace(/\./g, ",") + " €";
          }
        } else if (outputName.includes("priceSubtitle")) {
          // Fill the price subtitle
          json[outputName] = priceSettings.priceSubtitle;
        }
      }
    }
  });

  return [{ json }];
}
