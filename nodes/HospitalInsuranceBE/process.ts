import { loadSpeadsheetInfo } from "../../srcs/utils/accessSpreadsheet";
import getRowsMatchingAge from "../../srcs/utils/getRowsMatchingAge";
import IInput from "./interface/IInput";

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

export async function process(input: IInput) {
  const spreadSheet = await loadSpeadsheetInfo(input.spreadsheetId, [
    input.sheetName,
  ]);

  // We filter the rows on age range
  let matchingAgeRows = getRowsMatchingAge(
    spreadSheet[input.sheetName],
    input.age,
    "age"
  );

  matchingAgeRows = matchingAgeRows.filter(
    (row) => row["province"].toLowerCase() === input.province.toLowerCase()
  );

  const pricesRows = matchingAgeRows.map((row: any) => {
    return {
      name: row["name"],
      logoSubtitle: row["logoSubtitle"],
      price: parseFloat(row["price"].replace(/,/g, ".")),
      priceSubtitle:
        input.locale === "fr-BE"
          ? row["priceSubtitle"]
          : row["priceSubtitleNL"],
    };
  });

  return {
    pricesRows,
    locale: input.locale,
  };
}
