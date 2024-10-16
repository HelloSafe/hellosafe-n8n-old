import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import axios from "axios";
import {
  accessSpreadsheet,
  find_ofsp_match,
  get_prime_from_supabase,
  outputList,
  settings,
} from "./utils";

export class HealthInsuranceSwitzerland implements INodeType {
  description: INodeTypeDescription = {
    displayName: "HealthInsuranceSwitzerland",
    name: "HealthInsuranceSwitzerland",
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

    let spreadSheet = await accessSpreadsheet();
    const postalSheet = spreadSheet.sheetsById[455146918];
    const postalSheetRows = await postalSheet.getRows();
    const postalCodeRaw = postalSheetRows.filter((row, i) => {
      return row.get("postal") == postalCode;
    });

    const apiKey = process.env.SUPABASE_CLIENT_ANON_KEY ?? "";
    const sheet = await spreadSheet.sheetsById[
      (settings as any).ofspIndexGoogleSheetTabId[language]
    ].getRows();
    const canton = postalCodeRaw[0].get("canton");

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

    let json: { [key: string]: any } = {};
    for (let name of outputList[0]) {
      if (name.includes("price") && !name.includes("priceSubtitle")) {
        let index_info = find_ofsp_match(name, sheet);
        if (index_info.code != 0) {
          let price = get_prime_from_supabase(index_info, response.data);
          if (price != 0) {
            if (version === "$") {
              const offersWithPrices = outputList[0].filter((output) => {
                if (
                  !output.includes("price") ||
                  output.includes("priceSubtitle")
                ) {
                  return false;
                }
                const index_info = find_ofsp_match(output, sheet);
                if (index_info.code != 0) {
                  price = get_prime_from_supabase(index_info, response.data);
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
                  el.ofsp_code == index_info.code &&
                  el.rate_class == index_info.rate_class
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
