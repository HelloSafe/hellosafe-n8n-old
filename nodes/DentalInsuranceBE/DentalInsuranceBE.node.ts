import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import { loadSpeadsheetInfo } from "../../srcs/utils/accessSpreadsheet";
import formalizeString from "../../srcs/utils/formalizeString";
import getRowsMatchingAge from "../../srcs/utils/getRowsMatchingAge";

export class DentalInsuranceBE implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Dental Insurance BE",
    name: "DentalInsuranceBE",
    group: ["transform"],
    version: 1,
    description: "The Hellosafe Dental Insurance BE Node",
    defaults: {
      name: "DentalInsuranceBE",
    },
    icon: "file:hellosafe.svg",
    inputs: ["main"],
    outputs: ["main"],
    properties: [
      {
        displayName: "OutputList",
        typeOptions: {
          rows: 5,
        },
        name: "output",
        type: "string",
        default: "",
        required: true,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const inputs = items[0]?.json.body as any;
    const outputList = (this.getNodeParameter("output", 0) as string).split(
      ", "
    );

    const age = parseInt(inputs.age) ?? 30;

    const nl_province = ["Vlaanderen", "Brussel", "Wallonië"];

    const fr_province = ["Flandre", "Bruxelles", "Wallonie"];

    let province = "";

    // Setting the province name, as the one in the Gsheet, to be multi-language
    if (nl_province.includes(inputs.province)) {
      const idx = nl_province.indexOf(inputs.province);
      province = fr_province[idx];
    } else {
      if (fr_province.includes(inputs.province)) {
        province = inputs.province;
      }
    }

    const spreadSheet = await loadSpeadsheetInfo(
      "1oEfQKYKA49gTSNmWGI_nsuzaPs-MbP_4nbUI8xQVn10",
      ["prices"]
    );

    // We get filter to all row matching the age
    const filteredRows = getRowsMatchingAge(spreadSheet["prices"], age, "age");
    const json: any = {};

    for (let name of outputList) {

      // To only fill the price corresponding result
      if (name.includes("price") && !name.includes("priceSubtitle")) {
        filteredRows.forEach((row: any) => {

          // The matching current offer with the corresponding row in the sheet
          if (
            formalizeString(name).includes(
              formalizeString(row["insurance"] + row["formula"])
            )
          ) {
            
            json[name] = row[province.toLowerCase()];
          }
        });
      }
    }

    const outputItems: INodeExecutionData[] = [];
    outputItems.push({
      json,
    });

    return this.prepareOutputData(outputItems);
  }
}
