import { INodeExecutionData } from "n8n-workflow";
import formalizeString from "../../srcs/utils/formalizeString";

export default function prepareOutput(
  processedData: any,
  outputList: any
): INodeExecutionData[] {
  const json: { [key: string]: any } = {};
  for (let name of outputList) {
    // To only fill the price corresponding result
    if (name.includes("price") && !name.includes("priceSubtitle")) {
      processedData.filteredRows.forEach((row: any) => {
        // The matching current offer with the corresponding row in the sheet
        if (
          formalizeString(name).includes(
            formalizeString(row["insurance"] + row["formula"])
          )
        ) {
          json[name] = row[processedData.province.toLowerCase()];
        }
      });
    }
  }

  const outputItems: INodeExecutionData[] = [];
  outputItems.push({
    json,
  });
  return outputItems;
}
