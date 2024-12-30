import IInput from "./interfaces/IInput";
import { settings } from "./utils";

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
  const locale = rawInputs?.locale ?? "fr-CH";
  const language = locale.split("-")[0];

  // We got the age from the inputs
  const age: any =
    rawInputs?.age ?? (settings as any)?.ageSelections[language][0];
  const indexOfAge = (settings as any)?.ageSelections[language].indexOf(age);
  let ageCode = settings.ageCodesCorrespondingToAgeSelections[1];
  if (indexOfAge !== -1) {
    ageCode = settings.ageCodesCorrespondingToAgeSelections[indexOfAge];
  }

  // We set the cover code, depending of the input
  let coverCode = "OHN-UNF";
  if (rawInputs?.accidentCover == "true") {
    coverCode = "MIT-UNF";
  }
  const spreadsheetId =
    rawInputs.spreadsheetId ?? "1QbuYpRlCEk37o1nYc08rX2Na2OM3rXac6jfaQSi8sWU";
  const sheetPrices = rawInputs.sheetPrices ?? "prices!A:E";
  const sheetOFSP = rawInputs.sheetOFSP ?? "ofsp_index!A:B";
  const sheetRegion = rawInputs.sheetRegion ?? "codes_table!A:C";
  const location = rawInputs?.location ?? "";

  return {
    ageCode: ageCode,
    coverCode: coverCode,
    location: location,
    locale: locale,
    spreadsheetId: spreadsheetId,
    sheetPrices: sheetPrices,
    sheetOFSP: sheetOFSP,
    sheetRegion: sheetRegion,
  };
}
