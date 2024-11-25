import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import axios from "axios";

export class PersonalLoanBE implements INodeType {
  description: INodeTypeDescription = {
    displayName: "HelloSafe's Personal Loan BE",
    name: "Personal Loan BE",
    group: ["transform"],
    version: 1,
    description: "Get Price for the Comparator Personal Loan in Belgium",
    defaults: {
      name: "Personal Loan BE",
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
        required: true,
        typeOptions: {
          rows: 5,
        }, 
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const outputItems: INodeExecutionData[] = [];
    const apiKey = process.env.SUPABASE_CLIENT_ANON_KEY ?? "";
    const outputList = (this.getNodeParameter("output", 0) as string).split(
      ", "
    );
    // We get the inputs and format it
    const items = this.getInputData();
    const inputs = items[0]?.json.body as any;
    let amount = inputs.amount ? parseInt(inputs.amount) : 5000;
    let duration = inputs?.duration
      ? parseInt(inputs.duration.match(/\d+/))
      : 24;

    let url =
      "https://pnbpasamidjpaqxsprtm.supabase.co/rest/v1/data_pret_personel?select=*&amount=lte." +
      amount +
      "&limit=1" +
      "&durationSlider=eq." +
      duration;

    // We make the request, firstly to get the amount, from the approximation inputed
    let response = await axios.get(url, {
      headers: { apiKey: apiKey, Authorization: `Bearer ${apiKey}` },
    });

    amount = response.data[0].amount;
    duration = response.data[0].durationSlider;

    //Then we fetch again, with the exact closest amount value
    url =
      "https://pnbpasamidjpaqxsprtm.supabase.co/rest/v1/data_pret_personel?select=*&amount=eq." +
      amount +
      "&durationSlider=eq." +
      duration;

    response = await axios.get(url, {
      headers: { apiKey: apiKey, Authorization: `Bearer ${apiKey}` },
    });

    function getMonthly(rate: number, amount: number, duration: number) {
      return (amount * rate) / 12 / (1 - Math.pow(1 + rate / 12, -duration));
    }

    function getInterest(monthly: number, duration: number, amount: number) {
      return monthly * duration - amount;
    }

    const json: { [key: string]: any } = {};

    // We loop on the offer, to fill parameters
    response.data.forEach((item: any) => {
      amount = item.amount;
      duration = item.durationSlider;
      const monthlyValue = getMonthly(
        item.rate,
        item.amount,
        item.durationSlider
      );
      const interestValue = getInterest(
        monthlyValue,
        item.durationSlider,
        item.amount
      );

      outputList.forEach((offer: string) => {
        if (
          offer
            .toLocaleLowerCase()
            .replace(/\s/g, "")
            .includes(item.name.toLocaleLowerCase().replace(/\s/g, ""))
        ) {
          if (offer.includes("feature1")) {
            // Rate
            json[offer] = (item.rate * 100).toFixed(2) + " %";
          } else if (offer.includes("feature2")) {
            // Monthly
            json[offer] = parseFloat(monthlyValue.toFixed(2)) + " €";
          } else if (offer.includes("feature3")) {
            // Interest
            json[offer] = parseFloat(interestValue.toFixed(2)) + " €";
          }
        }
      });
    });

    outputItems.push({
      json,
    });

    return this.prepareOutputData(outputItems);
  }
}
