import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import axios from "axios";
import { findOfspMatch, getPrimeFromSupabase, outputList, settings } from "./utils";
import { loadSpeadsheetInfo } from "../../srcs/utils/accessSpreadsheet";

export class HealthInsuranceSwitzerland implements INodeType {
  description: INodeTypeDescription = {
    displayName: "HelloSafe's HealthInsuranceSwitzerland",
    name: "healthInsuranceSwitzerland",
    group: ["transform"],
    version: 1,
    description: "HealthInsuranceSwitzerland Node",
    defaults: {
      name: "HealthInsuranceSwitzerland",
    },
    icon: "file:hellosafe.svg",
    inputs: ["main"],
    outputs: ["main"],
    properties: [],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const inputs = items[0]?.json.body as any;
    const locale = inputs?.locale ?? "fr-CH";
    const language = locale.split("-")[0];
    const version = inputs?.version ?? "";
    const supabasePrimeIndexTable = "assurance_maladie_ch_prime_index_2025";

    const age: any =
      inputs?.age ?? (settings as any)?.ageSelections[language][0];
    const indexOfAge = (settings as any)?.ageSelections[language].indexOf(age);
    let ageCode = settings.ageCodesCorrespondingToAgeSelections[1];
    if (indexOfAge !== -1) {
      ageCode = settings.ageCodesCorrespondingToAgeSelections[indexOfAge];
    }

    let coverCode = "OHN-UNF";
    if (inputs?.accidentCover == "true") {
      coverCode = "MIT-UNF";
    }
    const postal =
      inputs?.postalCode ?? (settings as any)?.defaultPostalCode[language];
    const postalCode = postal.split(" ")[1];

    let franchise = inputs?.franchise ?? "1000";
    franchise = franchise.replace(/\s/g, "");
    franchise = parseInt(franchise.replace(/\'/g, ""));
    if (indexOfAge === 0) {
      franchise = 600;
    }

    const outputItems: INodeExecutionData[] = [];

    let spreadSheet = await loadSpeadsheetInfo(
      "1mHOPog6kosRTqRwkCjOiY1xGrcr_QLZRTdFLh1a4Xmo", ['postal', 'ofsp_index_2025', ]
    );
    const postalSheetRows = spreadSheet["postal"];
    const postalCodeRow = postalSheetRows.filter((row: any) => {
      return row["postal"] == postalCode;
    });

    const apiKey = process.env.SUPABASE_CLIENT_ANON_KEY ?? "";
    const sheet = spreadSheet["ofsp_index_2025"];
    const canton = postalCodeRow[0]["canton"];

    let url: string =
      `https://pnbpasamidjpaqxsprtm.supabase.co/rest/v1/${supabasePrimeIndexTable}?select=*` +
      "&region_code=eq." +
      canton +
      "&age_code=eq." +
      ageCode +
      "&coverage_code=eq." +
      coverCode +
      "&franchise=eq." +
      franchise;
    if (ageCode === "AKL-KIN") {
      url += "&age_subgroup_code=eq.K1";
    }

    const response = await axios.get(url, {
      headers: { apiKey: apiKey, Authorization: `Bearer ${apiKey}` },
    });

    const json: { [key: string]: any } = {};
    for (let name of outputList[0]) {
      if (name.includes("price") && !name.includes("priceSubtitle")) {
        let indexInfo = findOfspMatch(name, sheet);
        if (indexInfo.code != 0) {
          let price = getPrimeFromSupabase(indexInfo, response.data);
          if (price != 0) {
            if (version === "$") {
              const offersWithPrices = outputList[0].filter((output) => {
                if (
                  !output.includes("price") ||
                  output.includes("priceSubtitle")
                ) {
                  return false;
                }
                const indexInfo = findOfspMatch(output, sheet);
                if (indexInfo.code != 0) {
                  price = getPrimeFromSupabase(indexInfo, response.data);
                  if (price != 0) {
                    return true;
                  }
                }
                return false;
              });

              const sizeOfResults = offersWithPrices.length;
              const quartile = Math.floor(sizeOfResults / 4);

              const index = response.data.findIndex(
                (el: any) =>
                  el.ofsp_code == indexInfo.code &&
                  el.rate_class == indexInfo.rate_class
              );
              const repeatTimes = Math.floor(index / quartile) + 1;
              json[name] = "$".repeat(repeatTimes > 4 ? 4 : repeatTimes);
            } else {
              json[name] =
                parseFloat(price.replace(/,/g, "."))
                  .toFixed(2)
                  .toString()
                  .replace(/\./g, ",") + " CHF";
            }
          }
        }
      }
    }
    outputItems.push({
      json,
    });

    return this.prepareOutputData(outputItems);
  }
}
