import axios from "axios";
import { supabasePrimeIndexTable } from "./utils";

export async function processData(parsedInputs: any, spreadSheet:any) {
    const postalSheetRows = spreadSheet["postal!A:C"];
    const postalCodeRow = postalSheetRows.filter((row: any) => {
      return row["postal"] == parsedInputs.postalCode;
    });


    //Then we fetch supabase to get all offers pric matching the condition we already have -> Cover, Age, Region
    const apiKey = process.env.SUPABASE_CLIENT_ANON_KEY ?? "";
    const sheet = spreadSheet["ofsp_index_2025!A:D"];
    const canton = postalCodeRow[0]["canton"];

    let url: string =
      `https://pnbpasamidjpaqxsprtm.supabase.co/rest/v1/${supabasePrimeIndexTable}?select=*` +
      "&region_code=eq." +
      canton +
      "&age_code=eq." +
      parsedInputs.ageCode +
      "&coverage_code=eq." +
      parsedInputs.coverCode +
      "&franchise=eq." +
      parsedInputs.franchise;
    if (parsedInputs.ageCode === "AKL-KIN") {
      url += "&age_subgroup_code=eq.K1";
    }

    const response = await axios.get(url, {
      headers: { apiKey: apiKey, Authorization: `Bearer ${apiKey}` },
    });

    return {
        ...parsedInputs,
        'ofsp_sheet': sheet,
        'supabaseRows': response.data
    }

}