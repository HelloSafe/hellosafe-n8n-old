import { settings } from "./utils";

export function parseInputs(inputs: any): any {
    const locale = inputs?.locale ?? "fr-CH";
    const language = locale.split("-")[0];

    // We got the age from the inputs
    const age: any =
      inputs?.age ?? (settings as any)?.ageSelections[language][0];
    const indexOfAge = (settings as any)?.ageSelections[language].indexOf(age);
    let ageCode = settings.ageCodesCorrespondingToAgeSelections[1];
    if (indexOfAge !== -1) {
      ageCode = settings.ageCodesCorrespondingToAgeSelections[indexOfAge];
    }

    // We set the cover code, depending of the input
    let coverCode = "OHN-UNF";
    if (inputs?.accidentCover == "true") {
      coverCode = "MIT-UNF";
    }

    const location = inputs?.location ?? "";

    return {
      ageCode: ageCode,
      coverCode: coverCode,
      location: location,
    };
  }