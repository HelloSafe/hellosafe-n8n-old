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
  // We get the different input
  const locale = rawInputs?.locale ?? "fr-CH";
  const language = locale.split("-")[0];
  const isDollarVersion = (rawInputs?.version ?? "") === "$" ? true : false;
  let franchise = rawInputs?.franchise ?? "1000";

  // We format them as needed in the sheet
  const age: any =
    rawInputs?.age ?? (settings as any)?.ageSelections[language][0];
  const indexOfAge = (settings as any)?.ageSelections[language].indexOf(age);
  let ageCode = settings.ageCodesCorrespondingToAgeSelections[1];
  if (indexOfAge !== -1) {
    ageCode = settings.ageCodesCorrespondingToAgeSelections[indexOfAge];
  }

  let coverCode = "OHN-UNF";
  if (rawInputs?.accidentCover == "true") {
    coverCode = "MIT-UNF";
  }

  const postal =
    rawInputs?.postalCode ?? (settings as any)?.defaultPostalCode[language];
  const postalCode = postal.split(" ")[1];

  franchise = franchise.replace(/\s/g, "");
  franchise = parseInt(franchise.replace(/\'/g, ""));
  if (indexOfAge === 0) {
    franchise = 600;
  }

  const spreadsheetId =
    rawInputs.spreadsheetId ?? "1mHOPog6kosRTqRwkCjOiY1xGrcr_QLZRTdFLh1a4Xmo";
  const sheetPostal = rawInputs.sheetPostal ?? "postal!A:C";
  const sheetOFSP = rawInputs.sheetOFSP ?? "ofsp_index_2025!A:D";

  return {
    ageCode: ageCode,
    locale: locale,
    language: language,
    isDollarVersion: isDollarVersion,
    coverCode: coverCode,
    postalCode: postalCode,
    franchise: franchise,
    spreadsheetId: spreadsheetId,
    sheetPostal: sheetPostal,
    sheetOFSP: sheetOFSP,
  };
}
