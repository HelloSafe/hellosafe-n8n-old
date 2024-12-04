import IInput from "./interface/IInput";

/**
 * Parses raw input data into a structured format.
 * 
 * This function takes a raw input object and transforms it into a well-defined 
 * structure by applying default values and parsing logic as needed. It ensures
 * the resulting object adheres to the expected format of the target interface.
 * 
 * @param rawInputs - An object containing unstructured input data.
 * @returns A promise that resolves to the structured and validated input object.
 */
export default async function parse(rawInputs: any): Promise<IInput> {
    const spreadsheetId = rawInputs.spreadsheetId ?? "14GwCuDUNWbNKA2AakqMU-3u5IPxxEtT1vwIOLVxJ1CE";
    const sheetName = rawInputs.sheetName ?? "price_settings!A:H";
    const age = parseInt(rawInputs.age) ?? 30;
    const province = rawInputs.province ?? "Wallonie";
    const locale = rawInputs.locale ?? 'fr-BE'

    return {
      spreadsheetId,
      sheetName,
      age,
      locale,
      province
    };
  }
  