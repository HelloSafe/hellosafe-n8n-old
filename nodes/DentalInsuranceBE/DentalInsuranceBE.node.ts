import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import { loadSpeadsheetInfo } from "../../srcs/utils/accessSpreadsheet";
import { formalize } from "./utils";

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
        name: "output",
        type: "string",
        default: "",
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const inputs = items[0]?.json.body as any;
    const outputList = (this.getNodeParameter("output", 0) as string).split(", ");

    const nl_province = ["Vlaanderen", "Brussel", "Wallonië"];

    const fr_province = ["Flandre", "Bruxelles", "Wallonie"];

    let province = "";
    const age = parseInt(inputs.age) ?? 30;
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

    const priceRows = spreadSheet['prices'];
    const filteredRows = priceRows.filter((row: any) => {
        const range = row['age'];
        const minMax = range.split("-");

        const min = parseInt(minMax[0]);
        const max = parseInt(minMax[1]); 
        if (age <= max && age >= min) {
            return row;
        }
    })

    const json: any = {};

   for (let name of outputList) {
    if (name.includes("price") && !name.includes("priceSubtitle")) {
        filteredRows.forEach((row:any) =>{
            if (formalize(name).includes(formalize(row['insurance'] + row['formula']))) {
                json[name] = row[province.toLowerCase()];
            }
        })
    }
   }
    

    const outputItems: INodeExecutionData[] = [];
    outputItems.push({
      json,
    });

    return this.prepareOutputData(outputItems);
  }
}
