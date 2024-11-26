import { INodeExecutionData } from "n8n-workflow";
import formalizeString from "../../srcs/utils/formalizeString";

export function prepareOutput(processedData: any, outputList: any) {
  const json: any = {};

  processedData.matchingFilterRows.forEach((row: any) => {
    for (let name of outputList) {
      if (
        formalizeString(row["name"] + row["logoSubtitle"]).includes(
          formalizeString(name).split("_")[0]
        )
      ) {
        if (name.includes("price") && !name.includes("priceSubtitle")) {
          // Comparing if the price is the lowest or not

          if (json[name] != undefined) {
            let val1 = parseFloat(json[name].replace(/,/g, ".")).toFixed(2);
            let val2 = parseFloat(row["price"].replace(/,/g, ".")).toFixed(2);
            if (val2 < val1) {
              json[name] =
                parseFloat(row["price"].replace(/,/g, "."))
                  .toFixed(2)
                  .toString()
                  .replace(/\./g, ",") + " €";
            }
          } else {
            json[name] =
              parseFloat(row["price"].replace(/,/g, "."))
                .toFixed(2)
                .toString()
                .replace(/\./g, ",") + " €";
          }
        } else if (name.includes("priceSubtitle")) {
          // Fill the price subtitle
          if (processedData.locale === "nl-BE") {
            json[name] = row["priceSubtitleNL"];
          } else {
            json[name] = row["priceSubtitle"];
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
