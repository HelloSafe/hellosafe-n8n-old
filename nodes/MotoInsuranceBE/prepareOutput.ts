import { INodeExecutionData } from "n8n-workflow";
import formalizeString from "../../srcs/utils/formalizeString";

export function prepareOutput(processedData: any, outputList: any) {
  const json: any = {};

  Object.entries(processedData.headersValue).forEach(
    (offerName: any, index: number) => {
      for (let i = 0; i < outputList.length; i++) {
        const offerNameOptions = outputList[i];
        const match = formalizeString(offerNameOptions).includes(
          formalizeString(offerName[1])
        );
        if (match === true && offerNameOptions.includes("price")) {
          json[offerNameOptions] = processedData.priceList[0][offerName[1]];
          return;
        }
      }
    }
  );

  const outputItems: INodeExecutionData[] = [];
  outputItems.push({
    json,
  });
  return outputItems;
}
