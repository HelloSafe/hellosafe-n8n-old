import { loadSpeadsheetInfo } from "../../srcs/utils/accessSpreadsheet";
import IInput from "./interfaces/IInput";

export async function process(inputs: IInput) {
  const spreadSheet = await loadSpeadsheetInfo(inputs.spreadsheetId, [
    inputs.sheetName,
  ]);

  const priceRows =spreadSheet[inputs.sheetName] ;
  const headersValue = priceRows[0];

  const priceList: any = priceRows.filter((row: any, i: number) => {
    return row["type"] == inputs.type;
  });

  return {
    headersValue: headersValue,
    priceList: priceList,
  };
}
