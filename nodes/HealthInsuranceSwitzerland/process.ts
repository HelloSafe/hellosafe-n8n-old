import axios from "axios";
import { getPrimeFromSupabase, supabasePrimeIndexTable } from "./utils";
import IInput from "./interfaces/IInput";
import IProcessedData from "./interfaces/IProcessedData";
import { loadSpeadsheetInfo } from "../../srcs/utils/accessSpreadsheet";
import { ofsp } from "../../srcs/interfaces/IOfsp";

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
    input.sheetPostal,
    input.sheetOFSP,
  ]);
  const postalCodeRow = spreadSheet[input.sheetPostal].filter((row: any) => {
    return row["postal"] == input.postalCode;
  });

  //Then we fetch supabase to get all offers pric matching the condition we already have -> Cover, Age, Region
  const apiKey = globalThis.process.env.SUPABASE_CLIENT_ANON_KEY ?? "";
  const ofsp_sheet = spreadSheet[input.sheetOFSP];
  const data: ofsp[] = ofsp_sheet
    .filter((row: any) => row["ofsp_code"] !== "ofsp_code")
    .map((row: any) => {
      if (row["ofsp_code"] === "ofsp_code") {
        return {};
      }
      return {
        ofsp_code: row["ofsp_code"],
        name: row["insurer_name"].toLowerCase().replace(/\s/g, ""),
        contract: row["contract"].toLowerCase().replace(/\s/g, ""),
        rate_class: row["rate_class"],
      };
    });

  const canton = postalCodeRow[0]["canton"];

  let url: string =
    `https://pnbpasamidjpaqxsprtm.supabase.co/rest/v1/${supabasePrimeIndexTable}?select=*` +
    "&region_code=eq." +
    canton +
    "&age_code=eq." +
    input.ageCode +
    "&coverage_code=eq." +
    input.coverCode +
    "&franchise=eq." +
    input.franchise;
  if (input.ageCode === "AKL-KIN") {
    url += "&age_subgroup_code=eq.K1";
  }

  const response = await axios.get(url, {
    headers: { apiKey: apiKey, Authorization: `Bearer ${apiKey}` },
  });

  const supabaseRows = await response.data;

  const offersInfo = data
    .map((ofsp_info: ofsp) => {
      const price: string = getPrimeFromSupabase(ofsp_info, supabaseRows);
      return {
        name: ofsp_info.name + ofsp_info.contract,
        price: parseFloat(price.replace(/,/g, ".")),
      };
    })
    .filter((info) => !isNaN(info.price));

  return {
    isDollarVersion: input.version === "$",
    offersInfo: offersInfo,
  };
}
