import { findRegionCode } from "./utils";

export default function processData(parsedInputs: any, externalData: any): any {
    const locationCode = findRegionCode(
      parsedInputs.location,
      externalData["codes_table!A:C"]
    );
    return {
      ...parsedInputs,
      locationCode: locationCode,
      sheets: externalData,
    };
  }