import { ofsp } from "../../srcs/interfaces/IOfsp";

export function getPrimeFromSupabase(indexInfo: ofsp, supabaseRaw: any) {
  for (let raw of supabaseRaw) {
    if (
      raw.rate_class === indexInfo.rate_class &&
      raw.ofsp_code === indexInfo.ofsp_code.toString().padStart(4, "0")
    ) {
      return raw.prime;
    }
  }
  return '';
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
  ofspIndexGoogleSheetTabId: {
    fr: 1564587363, //ofsp_index_2025
    de: 1564587363, //ofsp_index_2025
    it: 1564587363, //ofsp_index_2025
    en: 1564587363, //ofsp_index_2025
  },
  defaultPostalCode: {
    fr: "1200",
    de: "1200",
    it: "1200",
    en: "1200",
  },
};
export const supabasePrimeIndexTable = "assurance_maladie_ch_prime_index_2025";