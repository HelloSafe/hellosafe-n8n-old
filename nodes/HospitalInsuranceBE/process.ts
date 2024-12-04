import { loadSpeadsheetInfo } from "../../srcs/utils/accessSpreadsheet";
import getRowsMatchingAge from "../../srcs/utils/getRowsMatchingAge";
import IInput from "./interface/IInput";

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
