import { INodeExecutionData } from "n8n-workflow";
import { getInterest, getMonthly } from "./utils";

export function prepareOutput(processedData: any, outputList: any) {
  const json: any = {};

  console.log(processedData);
  // We loop on the offer, to fill parameters
  processedData.priceList.forEach((item: any) => {
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
  const outputItems: INodeExecutionData[] = [];

  outputItems.push({
    json,
  });
  return outputItems;
}
