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
  const duration = rawInputs.duration ?? "10";
  const amount = parseInt(rawInputs.amount) ?? 100000;
  const type = rawInputs.type ?? "Fixe";
  const language = rawInputs.locale == "fr-BE" ? "fr" : "nl";
  const spreadsheetId = rawInputs.spreadsheetId ?? "10G1YmwdawjYjkIIPLcBFQeLPKSTPQwP2C-lskvImArc";
  const sheetName = rawInputs.sheetName ?? "rates_BE NEW!A:E";

  return {
    duration: duration,
    amount: amount,
    type: type,
    language,
    spreadsheetId,
    sheetName
  };
}
