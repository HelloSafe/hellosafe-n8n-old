import { loadSpeadsheetInfo } from "../../srcs/utils/accessSpreadsheet";
import getRowsMatchingAge from "../../srcs/utils/getRowsMatchingAge";
import IInput from "./interface/IInput";

export async function process(input: IInput) {
  const spreadSheet = await loadSpeadsheetInfo(input.spreadsheetId, [
    input.sheetName,
  ]);

  // We filter the rows on age range
  const matchingAgeRows = getRowsMatchingAge(
    spreadSheet[input.sheetName],
    input.age,
    "age"
  );

  const pricesRows = matchingAgeRows.map((row: any) => {
    return {
      name: row["name"],
      logoSubtitle: row["logoSubtitle"],
      price: row["price"],
      priceSubtitle:
        input.locale === "fr-BE"
          ? row["priceSubtitle"]
          : row["priceSubtitleNL"],
    };
  });

  return {
    pricesRows,
  };
}
