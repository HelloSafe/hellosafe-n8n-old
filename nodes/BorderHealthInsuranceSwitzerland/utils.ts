export function replaceSpecialWithNormal(input: string) {
  // Normalize the string to separate base letters from diacritics
  let normalized = input.normalize("NFD");
  // Remove diacritics and other marks using a regular expression
  let cleaned = normalized.replace(/[\u0300-\u036f]/g, "");
  return cleaned;
}

// Function to get the region code on the region sheet : https://docs.google.com/spreadsheets/d/1QbuYpRlCEk37o1nYc08rX2Na2OM3rXac6jfaQSi8sWU/edit?gid=1544244057#gid=1544244057
export function findRegionCode(regionName: string, regionsRow: any) {
  return regionsRow.filter(
    (row: any) =>
      row["correspondance_fr"] === regionName ||
      row["correspondance_de"] === regionName
  )[0]["code"];
}

// Function to get the price from all information we have : https://docs.google.com/spreadsheets/d/1QbuYpRlCEk37o1nYc08rX2Na2OM3rXac6jfaQSi8sWU/edit?gid=1074982097#gid=1074982097

export function getPrice(
  ofspCode: string,
  locationCode: string,
  accidentCode: string,
  ageCode: string,
  pricesRows: any
) {
  const matchingRow = pricesRows.filter(
    (row: any) =>
      row["ofsp_code"] === ofspCode &&
      row["location_code"] === locationCode &&
      row["age_code"] === ageCode &&
      row["accident_code"] === accidentCode
  );
  if (matchingRow[0]) {
    return `${parseInt(matchingRow[0]["price"])
      .toFixed(2)
      .toString()
      .replace(".", ",")} CHF`;
  } else {
    return "A.C";
  }
}

export function findOfspMatch(name: string, ofspRows: any) {
  for (let ofspRaw of ofspRows) {
    let insurerName = ofspRaw["insurer_name"]?.toLowerCase().replace(/\s/g, "");
    if (
      name
        .toLowerCase()
        .replace(/\s/g, "")
        .includes(replaceSpecialWithNormal(insurerName))
    ) {
      return {
        code: ofspRaw["ofsp_code"],
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
