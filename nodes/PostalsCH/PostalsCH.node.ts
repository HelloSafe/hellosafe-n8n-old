import axios from "axios";
import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";

export class PostalsCH implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Hellosafe Postal CH Node",
    name: "PostalsSwitzerland",
    group: ["transform"],
    version: 1,
    description: "The Hellosafe Node to get Postals in Switzerland",
    defaults: {
      name: "PostalsSwitzerland",
    },
    icon: "file:hellosafe.svg",
    inputs: ["main"],
    outputs: ["main"],
    properties: [],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const outputItems: INodeExecutionData[] = [];

    const apiKey = globalThis.process.env.SUPABASE_CLIENT_ANON_KEY ?? "";

    let url: string = `https://pnbpasamidjpaqxsprtm.supabase.co/rest/v1/switzerland_postals?select=*`;

    const response = await axios.get(url, {
      headers: { apiKey: apiKey, Authorization: `Bearer ${apiKey}` },
    });

    const supabaseRows = await response.data;

    const json: { value: string; name: string }[] = [];
    supabaseRows.map((row: any) => {
      json.push({
        value: row.postal,
        name: row.city + " " + row.postal,
      });
    });

    outputItems.push({
      json: { filterOptions: json },
    });

    return this.prepareOutputData(outputItems);
  }
}
