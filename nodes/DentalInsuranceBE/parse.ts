import IInput from "./interfaces/IInput";

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
  const age = parseInt(rawInputs.age) ?? 30;
  const spreadsheetId = rawInputs.spreadsheetId ?? "1oEfQKYKA49gTSNmWGI_nsuzaPs-MbP_4nbUI8xQVn10";
  const sheetName = rawInputs.sheetName ??  "prices!A:J";

  return {
    spreadsheetId: spreadsheetId,
    sheetName: sheetName,
    age: age,
    province: rawInputs.province ?? "Bruxelles",
  }
}