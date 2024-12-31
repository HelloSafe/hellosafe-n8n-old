import { loadSpeadsheetInfo } from "../../srcs/utils/accessSpreadsheet";
import formalizeString from "../../srcs/utils/formalizeString";
import IInput from "./interfaces/IInput";
import IProcessedData from "./interfaces/IProcessedData";

/**
 * Processes structured input data to calculate rates/prices/values/settings.
 * 
 * This function takes structured input, retrieves relevant data from an external 
 * spreadsheet, and calculates rate settings based on input parameters. It returns 
 * a processed object containing detailed financial calculations and metadata.
 * 
 * @param input - The structured input data to be processed.
 * @returns A promise that resolves to the processed data object, including rate 
 *          settings and other calculated information.
 */

export async function process(inputs: IInput): Promise<IProcessedData> {
  const spreadSheet = await loadSpeadsheetInfo(inputs.spreadsheetId, [
    inputs.sheetName,
  ]);

  const priceRows = spreadSheet[inputs.sheetName];
  const headersValue = priceRows[0];
  const prices: {
    name: string;
    price: string;
  }[] = [];

  const priceRowsMatch: any = priceRows.filter((row: any, i: number) => {
    return row["type"] == inputs.type;
  });


  Object.entries(headersValue).forEach((offerName: any, index: number) => {
    const item: any = {};
    item.name = formalizeString(offerName[1]);
    item.price = priceRowsMatch[0][offerName[1]];
    prices.push(item);
  });

  return {
    pricesSettings: prices,
  };
}
