import { loadSpeadsheetInfo } from "../../srcs/utils/accessSpreadsheet";
import getRowsMatchingAge from "../../srcs/utils/getRowsMatchingAge";
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
export default async function process(input: IInput): Promise<IProcessedData> {

  const spreadSheet = await loadSpeadsheetInfo(
    input.spreadsheetId,
    [input.sheetName]
  );

  const filteredRows = getRowsMatchingAge(
    spreadSheet[input.sheetName],
    input.age,
    "age"
  );

  const priceSettings = filteredRows.map((row:any) => {
    return {
      insurance: row['insurance'],
      formula: row['formula'],
      price: row[input.province.toLocaleLowerCase()],
    }
  })

  return {
    priceSettings
  };
}