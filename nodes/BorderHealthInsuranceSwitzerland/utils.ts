export function replaceSpecialWithNormal(input: string) {
  // Normalize the string to separate base letters from diacritics
  let normalized = input.normalize("NFD");
  // Remove diacritics and other marks using a regular expression
  let cleaned = normalized.replace(/[\u0300-\u036f]/g, "");
  return cleaned;
}

// Function to get the region code on the region sheet : https://docs.google.com/spreadsheets/d/1QbuYpRlCEk37o1nYc08rX2Na2OM3rXac6jfaQSi8sWU/edit?gid=1544244057#gid=1544244057
export function findRegionCode(
  regionName: string,
  regionsRow: any,
) {
  return regionsRow.filter((row: any) => row['correspondance_fr'] === regionName || row['correspondance_de'] === regionName)[0]['code'];
}

// Function to get the price from all information we have : https://docs.google.com/spreadsheets/d/1QbuYpRlCEk37o1nYc08rX2Na2OM3rXac6jfaQSi8sWU/edit?gid=1074982097#gid=1074982097

export function getPrice(
  ofspCode: string,
  locationCode: string,
  accidentCode: string,
  ageCode: string,
  pricesRows: any,
) {
  const matchingRow = pricesRows.filter(
    (row: any) =>
      row['ofsp_code'] === ofspCode &&
      row['location_code'] === locationCode &&
      row['age_code'] === ageCode &&
      row['accident_code'] === accidentCode
  );
  if (matchingRow[0]) {
    return `${parseInt(matchingRow[0]['price']).toFixed(2).toString().replace('.', ',')} CHF`;
  } else {
    return "A.C";
  }
}

export function findOfspMatch(
  name: string,
  ofspRows: any,
) {
  for (let ofspRaw of ofspRows) {
    let insurerName = ofspRaw['insurer_name']?.toLowerCase().replace(/\s/g, "");
    if (name.toLowerCase().replace(/\s/g, "").includes(replaceSpecialWithNormal(insurerName))) {
      return {
        code: ofspRaw['ofsp_code'],
      };
    }
  }
  return { code: 0 };
}

export const settings = {
  ageSelections: {
    fr: [
      "Enfant (0 - 18 ans)",
      "Jeune adulte (18 - 25 ans)",
      "Adulte (26 ans et plus)",
    ],
    de: [
      "Kind (0 - 18 Jahre)",
      "Junger Erwachsener (18 - 25 Jahre)",
      "Erwachsener (26 Jahre und älter)",
    ],
    it: [
      "Bambini (0 - 18 anni)",
      "Giovane adulto (18 - 25 anni)",
      "26 anni e oltre",
    ],
    en: [
      "Child (0 - 18 years)",
      "Young Adult (18 - 25 years)",
      "Adult (26 years and above)",
    ],
  },
  ageCodesCorrespondingToAgeSelections: ["AKL-KIN", "AKL-JUG", "AKL-ERW"],
};

export const outputList =
  "tikallAgrisano_price, tikallAgrisano_priceSubtitle, tikallAgrisano_feature1, tikallAgrisano_feature2, tikallAgrisano_feature3, tikallConcordia_price, tikallConcordia_priceSubtitle, tikallConcordia_feature1, tikallConcordia_feature2, tikallConcordia_feature3, tikallHelsana_price, tikallHelsana_priceSubtitle, tikallHelsana_feature1, tikallHelsana_feature2, tikallHelsana_feature3, tikallKpt_price, tikallKpt_priceSubtitle, tikallKpt_feature1, tikallKpt_feature2, tikallKpt_feature3, tikallSanitas_price, tikallSanitas_priceSubtitle, tikallSanitas_feature1, tikallSanitas_feature2, tikallSanitas_feature3, tikallSwica_price, tikallSwica_priceSubtitle, tikallSwica_feature1, tikallSwica_feature2, tikallSwica_feature3, tikallVisana_price, tikallVisana_priceSubtitle, tikallVisana_feature1, tikallVisana_feature2, tikallVisana_feature3, tikallCss_price, tikallCss_priceSubtitle, tikallCss_feature1, tikallCss_feature2, tikallCss_feature3, tikallAquilana_price, tikallAquilana_priceSubtitle, tikallAquilana_feature1, tikallAquilana_feature2, tikallAquilana_feature3, tikallAvenir_price, tikallAvenir_priceSubtitle, tikallAvenir_feature1, tikallAvenir_feature2, tikallAvenir_feature3, tikallOkk_price, tikallOkk_priceSubtitle, tikallOkk_feature1, tikallOkk_feature2, tikallOkk_feature3, tikallSympany_price, tikallSympany_priceSubtitle, tikallSympany_feature1, tikallSympany_feature2, tikallSympany_feature3, tikallSodalis_price, tikallSodalis_priceSubtitle, tikallSodalis_feature1, tikallSodalis_feature2, tikallSodalis_feature3, tikallAssura_price, tikallAssura_priceSubtitle, tikallAssura_feature1, tikallAssura_feature2, tikallAssura_feature3";
