import { loadSpeadsheetInfo } from "../../srcs/utils/accessSpreadsheet";
import formalizeString from "../../srcs/utils/formalizeString";
import IInput from "./interfaces/IInput";
import IProcessedData from "./interfaces/IProcessedData";
import { findRegionCode, getPrice } from "./utils";
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
  const spreadSheet = await loadSpeadsheetInfo(input.spreadsheetId, [
    input.sheetRegion,
    input.sheetOFSP,
    input.sheetPrices,
  ]);
  const locationCode = findRegionCode(
    input.location,
    spreadSheet[input.sheetRegion]
  );

  const ofsp_data = spreadSheet[input.sheetOFSP];

  const info: { name: string; price: number }[] = ofsp_data
    .filter((row: any) => row["ofsp_code"] !== "ofsp_code")
    .map((row: any) => {
      const price = getPrice(
        row["ofsp_code"],
        locationCode,
        input.coverCode,
        input.ageCode,
        spreadSheet[input.sheetPrices]
      );

      return {
        name: formalizeString(row["insurer_name"]),
        price: price,
      };
    });

  return { offersInfo: info };
}
