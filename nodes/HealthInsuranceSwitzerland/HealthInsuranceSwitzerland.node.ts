import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import axios from "axios";
import {
  findOfspMatch,
  getPrimeFromSupabase,
  settings,
  supabasePrimeIndexTable,
} from "./utils";
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
    properties: [
      {
        displayName: "OutputList",
        name: "output",
        type: "string",
        typeOptions: {
          rows: 5,
        },
        // to reset to ""
        default: "",
        required: true,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const outputList = (this.getNodeParameter("output", 0) as string).split(
      ", "
    );

    // We get the different input
    const inputs = items[0]?.json.body as any;
    const locale = inputs?.locale ?? "fr-CH";
    const language = locale.split("-")[0];
    const version = inputs?.version ?? "";
    let franchise = inputs?.franchise ?? "1000";

    // We format them as needed in the sheet
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

    franchise = franchise.replace(/\s/g, "");
    franchise = parseInt(franchise.replace(/\'/g, ""));
    if (indexOfAge === 0) {
      franchise = 600;
    }

    const outputItems: INodeExecutionData[] = [];

    let spreadSheet = await loadSpeadsheetInfo(
      "1mHOPog6kosRTqRwkCjOiY1xGrcr_QLZRTdFLh1a4Xmo", ['postal!A:C', 'ofsp_index_2025!A:D', ]
    );
    const postalSheetRows = spreadSheet["postal!A:C"];
    const postalCodeRow = postalSheetRows.filter((row: any) => {
      return row["postal"] == postalCode;
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
    for (let name of outputList) {
      if (name.includes("price") && !name.includes("priceSubtitle")) {

        // Here we get the ofsp_code form the gsheet 'ofsp_index_2025'
        let indexInfo = findOfspMatch(name, sheet);
        if (indexInfo.code != 0) {
          // We get the price via the ofsp_code in the matching previous offer from supabase
          let price = getPrimeFromSupabase(indexInfo, response.data);
          if (price != 0) {

            if (version === "$") {

              // We recall the loop for the "$" to get the number of mathcing offer
              // because it need the length of matching offer, to represent by quartile
              const offersWithPrices = outputList.filter((output) => {
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
