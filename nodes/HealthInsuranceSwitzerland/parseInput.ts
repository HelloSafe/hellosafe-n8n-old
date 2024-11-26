import { settings } from "./utils";

export function parseInput(inputs: any) {
  // We get the different input
  const locale = inputs?.locale ?? "fr-CH";
  const language = locale.split("-")[0];
  const version = inputs?.version ?? "";
  let franchise = inputs?.franchise ?? "1000";

  // We format them as needed in the sheet
  const age: any = inputs?.age ?? (settings as any)?.ageSelections[language][0];
  const indexOfAge = (settings as any)?.ageSelections[language].indexOf(age);
  let ageCode = settings.ageCodesCorrespondingToAgeSelections[1];
  if (indexOfAge !== -1) {
    ageCode = settings.ageCodesCorrespondingToAgeSelections[indexOfAge];
  }

  let coverCode = "OHN-UNF";
  if (inputs?.accidentCover == "true") {
    coverCode = "MIT-UNF";
  }

  const postal =
    inputs?.postalCode ?? (settings as any)?.defaultPostalCode[language];
  const postalCode = postal.split(" ")[1];

  franchise = franchise.replace(/\s/g, "");
  franchise = parseInt(franchise.replace(/\'/g, ""));
  if (indexOfAge === 0) {
    franchise = 600;
  }

  return {
    'ageCode': ageCode,
    'locale': locale,
    'language': language,
    'version': version,
    'coverCode': coverCode,
    'postalCode': postalCode,
    'franchise': franchise,
  }
}
