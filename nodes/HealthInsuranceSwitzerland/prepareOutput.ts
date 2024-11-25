import { INodeExecutionData } from "n8n-workflow";
import { findOfspMatch, getPrimeFromSupabase } from "./utils";

export function prepareOutput(processedData: any, outputList: any) {
  const json: { [key: string]: any } = {};
  const outputItems: INodeExecutionData[] = [];

  for (let name of outputList) {
    if (name.includes("price") && !name.includes("priceSubtitle")) {
      // Here we get the ofsp_code form the gsheet 'ofsp_index_2025'
      let indexInfo = findOfspMatch(name, processedData.ofsp_sheet);
      if (indexInfo.code != 0) {
        // We get the price via the ofsp_code in the matching previous offer from supabase
        let price = getPrimeFromSupabase(indexInfo, processedData.supabaseRows);
        if (price != 0) {
          if (processedData.version === "$") {
            // We recall the loop for the "$" to get the number of mathcing offer
            // because it need the length of matching offer, to represent by quartile
            const offersWithPrices = outputList.filter((output: string) => {
              if (
                !output.includes("price") ||
                output.includes("priceSubtitle")
              ) {
                return false;
              }
              const indexInfo = findOfspMatch(output, processedData.ofsp_sheet);
              if (indexInfo.code != 0) {
                price = getPrimeFromSupabase(
                  indexInfo,
                  processedData.supabaseRows
                );
                if (price != 0) {
                  return true;
                }
              }
              return false;
            });

            const sizeOfResults = offersWithPrices.length;
            const quartile = Math.floor(sizeOfResults / 4);

            const index = processedData.supabaseRows.findIndex(
              (el: any) =>
                el.ofsp_code == indexInfo.code &&
                el.rate_class == indexInfo.rate_class
            );
            const repeatTimes = Math.floor(index / quartile) + 1;
            json[name] = "$".repeat(repeatTimes > 4 ? 4 : repeatTimes);
          } else {
            json[name] =
              parseFloat(price.replace(/,/g, "."))
                .toFixed(2)
                .toString()
                .replace(/\./g, ",") + " CHF";
          }
        }
      }
    }
  }
  outputItems.push({
    json,
  });
  return outputItems;
}
