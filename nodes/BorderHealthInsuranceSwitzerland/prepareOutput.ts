import { INodeExecutionData } from "n8n-workflow";
import { findOfspMatch, getPrice } from "./utils";

export default function prepareOutput(processedData: any, outputList: any): INodeExecutionData[] {
    const outputItems: INodeExecutionData[] = [];

    const json: { [key: string]: any } = {};

    for (let name of outputList) {
      if (name.includes("price") && !name.includes("priceSubtitle")) {
        let indexInfo = findOfspMatch(
          name,
          processedData.sheets["ofsp_index!A:B"]
        );
        if (indexInfo.code != 0) {
          json[name] = getPrice(
            indexInfo.code,
            processedData.locationCode,
            processedData.coverCode,
            processedData.ageCode,
            processedData.sheets["prices!A:E"]
          );
        }
      }
    }

    outputItems.push({
      json,
    });

    return outputItems;
  }