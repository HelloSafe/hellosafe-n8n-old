import { JWT } from "google-auth-library";
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet";

export async function accessSpreadsheet() {
  const credentials = JSON.parse(
    process.env.SPREADSHEET_API_CREDENTIALS ?? ""
  ) as Credentials;
  const serviceAccountAuth = new JWT({
    email: credentials?.client_email,
    key: credentials?.private_key,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.file",
    ],
  });

  const doc = new GoogleSpreadsheet(
    "1mHOPog6kosRTqRwkCjOiY1xGrcr_QLZRTdFLh1a4Xmo",
    serviceAccountAuth
  );

  await doc.loadInfo(); // loads document properties and worksheets
  return doc;
}

export function find_ofsp_match(
  name: string,
  ofsp_raws: GoogleSpreadsheetRow<Record<string, any>>[]
) {
  for (let ofsp_raw of ofsp_raws) {
    let insurer_name = new RegExp(
      "^" + ofsp_raw.get("insurer_name").toLowerCase().replace(/\s/g, ""),
      "i"
    );
    if (
      name
        .toLowerCase()
        .includes(ofsp_raw.get("contract").toLowerCase().replace(/\s/g, "")) &&
      insurer_name.test(name.toLowerCase())
    ) {
      return {
        code: ofsp_raw.get("ofsp_code"),
        rate_class: ofsp_raw.get("rate_class"),
      };
    }
  }
  return { code: 0 };
}

export function get_prime_from_supabase(index_info: any, supabaseRaw: any) {
  for (let raw of supabaseRaw) {
    if (
      raw.rate_class === index_info.rate_class &&
      raw.ofsp_code === index_info.code.toString().padStart(4, "0")
    ) {
      return raw.prime;
    }
  }
  return 0;
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
      en: 1564587363,
    },
    defaultPostalCode: {
      fr: "Genève 1200",
      de: "Genève 1200",
      it: "Genève 1200",
      en: "Genève 1200",
    },
  };

  export const outputList = [
    "agrisanoAgricontact_price, agrisanoAgricontact_priceSubtitle, agrisanoAgricontact_feature1, agrisanoAgricontact_feature2, agrisanoAgricontact_feature3, agrisanoAgrieco_price, agrisanoAgrieco_priceSubtitle, agrisanoAgrieco_feature1, agrisanoAgrieco_feature2, agrisanoAgrieco_feature3, agrisanoAssuranceDeBase_price, agrisanoAssuranceDeBase_priceSubtitle, agrisanoAssuranceDeBase_feature1, agrisanoAssuranceDeBase_feature2, agrisanoAssuranceDeBase_feature3, aquilanaAssuranceDeBase_price, aquilanaAssuranceDeBase_priceSubtitle, aquilanaAssuranceDeBase_feature1, aquilanaAssuranceDeBase_feature2, aquilanaAssuranceDeBase_feature3, aquilanaSmartmed_price, aquilanaSmartmed_priceSubtitle, aquilanaSmartmed_feature1, aquilanaSmartmed_feature2, aquilanaSmartmed_feature3, assuraAssurcall_price, assuraAssurcall_priceSubtitle, assuraAssurcall_feature1, assuraAssurcall_feature2, assuraAssurcall_feature3, assuraMedecinDeFamille_price, assuraMedecinDeFamille_priceSubtitle, assuraMedecinDeFamille_feature1, assuraMedecinDeFamille_feature2, assuraMedecinDeFamille_feature3, assuraPharmed_price, assuraPharmed_priceSubtitle, assuraPharmed_feature1, assuraPharmed_feature2, assuraPharmed_feature3, assuraPlusmed_price, assuraPlusmed_priceSubtitle, assuraPlusmed_feature1, assuraPlusmed_feature2, assuraPlusmed_feature3, assuraPreventomed_price, assuraPreventomed_priceSubtitle, assuraPreventomed_feature1, assuraPreventomed_feature2, assuraPreventomed_feature3, assuraQualimed_price, assuraQualimed_priceSubtitle, assuraQualimed_feature1, assuraQualimed_feature2, assuraQualimed_feature3, assuraReseauDeSoins_price, assuraReseauDeSoins_priceSubtitle, assuraReseauDeSoins_feature1, assuraReseauDeSoins_feature2, assuraReseauDeSoins_feature3, atupriAssuranceDeBase_price, atupriAssuranceDeBase_priceSubtitle, atupriAssuranceDeBase_feature1, atupriAssuranceDeBase_feature2, atupriAssuranceDeBase_feature3, atupriCaremed_price, atupriCaremed_priceSubtitle, atupriCaremed_feature1, atupriCaremed_feature2, atupriCaremed_feature3, atupriFlexcare_price, atupriFlexcare_priceSubtitle, atupriFlexcare_feature1, atupriFlexcare_feature2, atupriFlexcare_feature3, atupriHmo_price, atupriHmo_priceSubtitle, atupriHmo_feature1, atupriHmo_feature2, atupriHmo_feature3, atupriSmartcare_price, atupriSmartcare_priceSubtitle, atupriSmartcare_feature1, atupriSmartcare_feature2, atupriSmartcare_feature3, atupriTelfirst_price, atupriTelfirst_priceSubtitle, atupriTelfirst_feature1, atupriTelfirst_feature2, atupriTelfirst_feature3, birchmeierKkAssuranceDeBase_price, birchmeierKkAssuranceDeBase_priceSubtitle, birchmeierKkAssuranceDeBase_feature1, birchmeierKkAssuranceDeBase_feature2, birchmeierKkAssuranceDeBase_feature3, birchmeierKkMedecinDeFamille_price, birchmeierKkMedecinDeFamille_priceSubtitle, birchmeierKkMedecinDeFamille_feature1, birchmeierKkMedecinDeFamille_feature2, birchmeierKkMedecinDeFamille_feature3, cmValleeD'entremontAssuranceDeBase_price, cmValleeD'entremontAssuranceDeBase_priceSubtitle, cmValleeD'entremontAssuranceDeBase_feature1, cmValleeD'entremontAssuranceDeBase_feature2, cmValleeD'entremontAssuranceDeBase_feature3, cmValleeD'entremontSanatel_price, cmValleeD'entremontSanatel_priceSubtitle, cmValleeD'entremontSanatel_feature1, cmValleeD'entremontSanatel_feature2, cmValleeD'entremontSanatel_feature3, concordiaAssuranceDeBase_price, concordiaAssuranceDeBase_priceSubtitle, concordiaAssuranceDeBase_feature1, concordiaAssuranceDeBase_feature2, concordiaAssuranceDeBase_feature3, concordiaHmo_price, concordiaHmo_priceSubtitle, concordiaHmo_feature1, concordiaHmo_feature2, concordiaHmo_feature3, concordiaMydoc_price, concordiaMydoc_priceSubtitle, concordiaMydoc_feature1, concordiaMydoc_feature2, concordiaMydoc_feature3, concordiaSmartdoc_price, concordiaSmartdoc_priceSubtitle, concordiaSmartdoc_feature1, concordiaSmartdoc_feature2, concordiaSmartdoc_feature3, cssAssuranceDeBase_price, cssAssuranceDeBase_priceSubtitle, cssAssuranceDeBase_feature1, cssAssuranceDeBase_feature2, cssAssuranceDeBase_feature3, cssHmo_price, cssHmo_priceSubtitle, cssHmo_feature1, cssHmo_feature2, cssHmo_feature3, cssMedecinDeFamilleProfit_price, cssMedecinDeFamilleProfit_priceSubtitle, cssMedecinDeFamilleProfit_feature1, cssMedecinDeFamilleProfit_feature2, cssMedecinDeFamilleProfit_feature3, cssMultimed_price, cssMultimed_priceSubtitle, cssMultimed_feature1, cssMultimed_feature2, cssMultimed_feature3, cssTelmed_price, cssTelmed_priceSubtitle, cssTelmed_feature1, cssTelmed_feature2, cssTelmed_feature3, egkAssuranceDeBase_price, egkAssuranceDeBase_priceSubtitle, egkAssuranceDeBase_feature1, egkAssuranceDeBase_feature2, egkAssuranceDeBase_feature3, egkEgkCare_price, egkEgkCare_priceSubtitle, egkEgkCare_feature1, egkEgkCare_feature2, egkEgkCare_feature3, egkEgkTelcare_price, egkEgkTelcare_priceSubtitle, egkEgkTelcare_feature1, egkEgkTelcare_feature2, egkEgkTelcare_feature3, einsiedlerAssuranceDeBase_price, einsiedlerAssuranceDeBase_priceSubtitle, einsiedlerAssuranceDeBase_feature1, einsiedlerAssuranceDeBase_feature2, einsiedlerAssuranceDeBase_feature3, galenosAssuranceDeBase_price, galenosAssuranceDeBase_priceSubtitle, galenosAssuranceDeBase_feature1, galenosAssuranceDeBase_feature2, galenosAssuranceDeBase_feature3, galenosHam_price, galenosHam_priceSubtitle, galenosHam_feature1, galenosHam_feature2, galenosHam_feature3, galenosHmo_price, galenosHmo_priceSubtitle, galenosHmo_feature1, galenosHmo_feature2, galenosHmo_feature3, galenosMedDirect_price, galenosMedDirect_priceSubtitle, galenosMedDirect_feature1, galenosMedDirect_feature2, galenosMedDirect_feature3, glarnerAssuranceDeBase_price, glarnerAssuranceDeBase_priceSubtitle, glarnerAssuranceDeBase_feature1, glarnerAssuranceDeBase_feature2, glarnerAssuranceDeBase_feature3, glarnerGlarnermed24_price, glarnerGlarnermed24_priceSubtitle, glarnerGlarnermed24_feature1, glarnerGlarnermed24_feature2, glarnerGlarnermed24_feature3, groupeMutuelAssuranceDeBase_price, groupeMutuelAssuranceDeBase_priceSubtitle, groupeMutuelAssuranceDeBase_feature1, groupeMutuelAssuranceDeBase_feature2, groupeMutuelAssuranceDeBase_feature3, groupeMutuelOptimed_price, groupeMutuelOptimed_priceSubtitle, groupeMutuelOptimed_feature1, groupeMutuelOptimed_feature2, groupeMutuelOptimed_feature3, groupeMutuelPrimacare_price, groupeMutuelPrimacare_priceSubtitle, groupeMutuelPrimacare_feature1, groupeMutuelPrimacare_feature2, groupeMutuelPrimacare_feature3, groupeMutuelPrimaflex_price, groupeMutuelPrimaflex_priceSubtitle, groupeMutuelPrimaflex_feature1, groupeMutuelPrimaflex_feature2, groupeMutuelPrimaflex_feature3, groupeMutuelSanatel_price, groupeMutuelSanatel_priceSubtitle, groupeMutuelSanatel_feature1, groupeMutuelSanatel_feature2, groupeMutuelSanatel_feature3, helsanaAssuranceDeBase_price, helsanaAssuranceDeBase_priceSubtitle, helsanaAssuranceDeBase_feature1, helsanaAssuranceDeBase_feature2, helsanaAssuranceDeBase_feature3, helsanaBenefitPlusFlexmed_price, helsanaBenefitPlusFlexmed_priceSubtitle, helsanaBenefitPlusFlexmed_feature1, helsanaBenefitPlusFlexmed_feature2, helsanaBenefitPlusFlexmed_feature3, helsanaBenefitPlusTelmed_price, helsanaBenefitPlusTelmed_priceSubtitle, helsanaBenefitPlusTelmed_feature1, helsanaBenefitPlusTelmed_feature2, helsanaBenefitPlusTelmed_feature3, helsanaBenefitPlusMedecinDeFamille_price, helsanaBenefitPlusMedecinDeFamille_priceSubtitle, helsanaBenefitPlusMedecinDeFamille_feature1, helsanaBenefitPlusMedecinDeFamille_feature2, helsanaBenefitPlusMedecinDeFamille_feature3, helsanaPremed24_price, helsanaPremed24_priceSubtitle, helsanaPremed24_feature1, helsanaPremed24_feature2, helsanaPremed24_feature3, klugAssuranceDeBase_price, klugAssuranceDeBase_priceSubtitle, klugAssuranceDeBase_feature1, klugAssuranceDeBase_feature2, klugAssuranceDeBase_feature3, klugMedecinDeFamille_price, klugMedecinDeFamille_priceSubtitle, klugMedecinDeFamille_feature1, klugMedecinDeFamille_feature2, klugMedecinDeFamille_feature3, kptAssuranceDeBase_price, kptAssuranceDeBase_priceSubtitle, kptAssuranceDeBase_feature1, kptAssuranceDeBase_feature2, kptAssuranceDeBase_feature3, kptKptwin.doc_price, kptKptwin.doc_priceSubtitle, kptKptwin.doc_feature1, kptKptwin.doc_feature2, kptKptwin.doc_feature3, kptKptwin.easy_price, kptKptwin.easy_priceSubtitle, kptKptwin.easy_feature1, kptKptwin.easy_feature2, kptKptwin.easy_feature3, kptKptwin.plus_price, kptKptwin.plus_priceSubtitle, kptKptwin.plus_feature1, kptKptwin.plus_feature2, kptKptwin.plus_feature3, kptKptwin.win_price, kptKptwin.win_priceSubtitle, kptKptwin.win_feature1, kptKptwin.win_feature2, kptKptwin.win_feature3, luzernerHinterlandKkAssuranceDeBase_price, luzernerHinterlandKkAssuranceDeBase_priceSubtitle, luzernerHinterlandKkAssuranceDeBase_feature1, luzernerHinterlandKkAssuranceDeBase_feature2, luzernerHinterlandKkAssuranceDeBase_feature3, luzernerHinterlandKkHausmed_price, luzernerHinterlandKkHausmed_priceSubtitle, luzernerHinterlandKkHausmed_feature1, luzernerHinterlandKkHausmed_feature2, luzernerHinterlandKkHausmed_feature3, luzernerHinterlandKkTelmed_price, luzernerHinterlandKkTelmed_priceSubtitle, luzernerHinterlandKkTelmed_feature1, luzernerHinterlandKkTelmed_feature2, luzernerHinterlandKkTelmed_feature3, okkAssuranceDeBase_price, okkAssuranceDeBase_priceSubtitle, okkAssuranceDeBase_feature1, okkAssuranceDeBase_feature2, okkAssuranceDeBase_feature3, okkCasamed24_price, okkCasamed24_priceSubtitle, okkCasamed24_feature1, okkCasamed24_feature2, okkCasamed24_feature3, okkCasamedHmo_price, okkCasamedHmo_priceSubtitle, okkCasamedHmo_feature1, okkCasamedHmo_feature2, okkCasamedHmo_feature3, okkCasamedSelect_price, okkCasamedSelect_priceSubtitle, okkCasamedSelect_feature1, okkCasamedSelect_feature2, okkCasamedSelect_feature3, okkMedecinDeFamille_price, okkMedecinDeFamille_priceSubtitle, okkMedecinDeFamille_feature1, okkMedecinDeFamille_feature2, okkMedecinDeFamille_feature3, rhenusanaAssuranceDeBase_price, rhenusanaAssuranceDeBase_priceSubtitle, rhenusanaAssuranceDeBase_feature1, rhenusanaAssuranceDeBase_feature2, rhenusanaAssuranceDeBase_feature3, rhenusanaMedecinDeFamille_price, rhenusanaMedecinDeFamille_priceSubtitle, rhenusanaMedecinDeFamille_feature1, rhenusanaMedecinDeFamille_feature2, rhenusanaMedecinDeFamille_feature3, rhenusanaSanmed24_price, rhenusanaSanmed24_priceSubtitle, rhenusanaSanmed24_feature1, rhenusanaSanmed24_feature2, rhenusanaSanmed24_feature3, sanavalsAssuranceDeBase_price, sanavalsAssuranceDeBase_priceSubtitle, sanavalsAssuranceDeBase_feature1, sanavalsAssuranceDeBase_feature2, sanavalsAssuranceDeBase_feature3, sanavalsMedecinDeFamille_price, sanavalsMedecinDeFamille_priceSubtitle, sanavalsMedecinDeFamille_feature1, sanavalsMedecinDeFamille_feature2, sanavalsMedecinDeFamille_feature3, sanitasAssuranceDeBase_price, sanitasAssuranceDeBase_priceSubtitle, sanitasAssuranceDeBase_feature1, sanitasAssuranceDeBase_feature2, sanitasAssuranceDeBase_feature3, sanitasCallmed_price, sanitasCallmed_priceSubtitle, sanitasCallmed_feature1, sanitasCallmed_feature2, sanitasCallmed_feature3, sanitasCaremed_price, sanitasCaremed_priceSubtitle, sanitasCaremed_feature1, sanitasCaremed_feature2, sanitasCaremed_feature3, sanitasCompactone_price, sanitasCompactone_priceSubtitle, sanitasCompactone_feature1, sanitasCompactone_feature2, sanitasCompactone_feature3, sanitasMedbaseMultiaccess_price, sanitasMedbaseMultiaccess_priceSubtitle, sanitasMedbaseMultiaccess_feature1, sanitasMedbaseMultiaccess_feature2, sanitasMedbaseMultiaccess_feature3, sanitasNetmed1_price, sanitasNetmed1_priceSubtitle, sanitasNetmed1_feature1, sanitasNetmed1_feature2, sanitasNetmed1_feature3, slkkAssuranceDeBase_price, slkkAssuranceDeBase_priceSubtitle, slkkAssuranceDeBase_feature1, slkkAssuranceDeBase_feature2, slkkAssuranceDeBase_feature3, slkkSlkkHomecare_price, slkkSlkkHomecare_priceSubtitle, slkkSlkkHomecare_feature1, slkkSlkkHomecare_feature2, slkkSlkkHomecare_feature3, slkkSlkkSmartmed_price, slkkSlkkSmartmed_priceSubtitle, slkkSlkkSmartmed_feature1, slkkSlkkSmartmed_feature2, slkkSlkkSmartmed_feature3, slkkSlkkTelcare_price, slkkSlkkTelcare_priceSubtitle, slkkSlkkTelcare_feature1, slkkSlkkTelcare_feature2, slkkSlkkTelcare_feature3, sodalisAssuranceDeBase_price, sodalisAssuranceDeBase_priceSubtitle, sodalisAssuranceDeBase_feature1, sodalisAssuranceDeBase_feature2, sodalisAssuranceDeBase_feature3, sodalisDigimed_price, sodalisDigimed_priceSubtitle, sodalisDigimed_feature1, sodalisDigimed_feature2, sodalisDigimed_feature3, sodalisMedicasa_price, sodalisMedicasa_priceSubtitle, sodalisMedicasa_feature1, sodalisMedicasa_feature2, sodalisMedicasa_feature3, sodalisTelmed_price, sodalisTelmed_priceSubtitle, sodalisTelmed_feature1, sodalisTelmed_feature2, sodalisTelmed_feature3, steffisburgKkAssuranceDeBase_price, steffisburgKkAssuranceDeBase_priceSubtitle, steffisburgKkAssuranceDeBase_feature1, steffisburgKkAssuranceDeBase_feature2, steffisburgKkAssuranceDeBase_feature3, steffisburgKkCasa_price, steffisburgKkCasa_priceSubtitle, steffisburgKkCasa_feature1, steffisburgKkCasa_feature2, steffisburgKkCasa_feature3, steffisburgKkMedcasa_price, steffisburgKkMedcasa_priceSubtitle, steffisburgKkMedcasa_feature1, steffisburgKkMedcasa_feature2, steffisburgKkMedcasa_feature3, steffisburgKkRegiomed_price, steffisburgKkRegiomed_priceSubtitle, steffisburgKkRegiomed_feature1, steffisburgKkRegiomed_feature2, steffisburgKkRegiomed_feature3, steffisburgKkSanmed24_price, steffisburgKkSanmed24_priceSubtitle, steffisburgKkSanmed24_feature1, steffisburgKkSanmed24_feature2, steffisburgKkSanmed24_feature3, sumiswalderKkAssuranceDeBase_price, sumiswalderKkAssuranceDeBase_priceSubtitle, sumiswalderKkAssuranceDeBase_feature1, sumiswalderKkAssuranceDeBase_feature2, sumiswalderKkAssuranceDeBase_feature3, sumiswalderKkHausarzt_price, sumiswalderKkHausarzt_priceSubtitle, sumiswalderKkHausarzt_feature1, sumiswalderKkHausarzt_feature2, sumiswalderKkHausarzt_feature3, sumiswalderKkTelmed_price, sumiswalderKkTelmed_priceSubtitle, sumiswalderKkTelmed_feature1, sumiswalderKkTelmed_feature2, sumiswalderKkTelmed_feature3, swicaAssuranceDeBase_price, swicaAssuranceDeBase_priceSubtitle, swicaAssuranceDeBase_feature1, swicaAssuranceDeBase_feature2, swicaAssuranceDeBase_feature3, swicaFavoritCasa_price, swicaFavoritCasa_priceSubtitle, swicaFavoritCasa_feature1, swicaFavoritCasa_feature2, swicaFavoritCasa_feature3, swicaFavoritMedica_price, swicaFavoritMedica_priceSubtitle, swicaFavoritMedica_feature1, swicaFavoritMedica_feature2, swicaFavoritMedica_feature3, swicaFavoritMedpharm_price, swicaFavoritMedpharm_priceSubtitle, swicaFavoritMedpharm_feature1, swicaFavoritMedpharm_feature2, swicaFavoritMedpharm_feature3, swicaFavoritMultichoice_price, swicaFavoritMultichoice_priceSubtitle, swicaFavoritMultichoice_feature1, swicaFavoritMultichoice_feature2, swicaFavoritMultichoice_feature3, swicaFavoritSante_price, swicaFavoritSante_priceSubtitle, swicaFavoritSante_feature1, swicaFavoritSante_feature2, swicaFavoritSante_feature3, swicaFavoritTelmed_price, swicaFavoritTelmed_priceSubtitle, swicaFavoritTelmed_feature1, swicaFavoritTelmed_feature2, swicaFavoritTelmed_feature3, sympanyAssuranceDeBase_price, sympanyAssuranceDeBase_priceSubtitle, sympanyAssuranceDeBase_feature1, sympanyAssuranceDeBase_feature2, sympanyAssuranceDeBase_feature3, sympanyCallmed24_price, sympanyCallmed24_priceSubtitle, sympanyCallmed24_feature1, sympanyCallmed24_feature2, sympanyCallmed24_feature3, sympanyCasamedHmo_price, sympanyCasamedHmo_priceSubtitle, sympanyCasamedHmo_feature1, sympanyCasamedHmo_feature2, sympanyCasamedHmo_feature3, sympanyCasamedMedecinDeFamille_price, sympanyCasamedMedecinDeFamille_priceSubtitle, sympanyCasamedMedecinDeFamille_feature1, sympanyCasamedMedecinDeFamille_feature2, sympanyCasamedMedecinDeFamille_feature3, sympanyCasamedPharm_price, sympanyCasamedPharm_priceSubtitle, sympanyCasamedPharm_feature1, sympanyCasamedPharm_feature2, sympanyCasamedPharm_feature3, sympanyFlexhelp24_price, sympanyFlexhelp24_priceSubtitle, sympanyFlexhelp24_feature1, sympanyFlexhelp24_feature2, sympanyFlexhelp24_feature3, visanaAssuranceDeBase_price, visanaAssuranceDeBase_priceSubtitle, visanaAssuranceDeBase_feature1, visanaAssuranceDeBase_feature2, visanaAssuranceDeBase_feature3, visanaCombiCare_price, visanaCombiCare_priceSubtitle, visanaCombiCare_feature1, visanaCombiCare_feature2, visanaCombiCare_feature3, visanaManagesCare_price, visanaManagesCare_priceSubtitle, visanaManagesCare_feature1, visanaManagesCare_feature2, visanaManagesCare_feature3, visanaMedCall_price, visanaMedCall_priceSubtitle, visanaMedCall_feature1, visanaMedCall_feature2, visanaMedCall_feature3, visanaMedDirect_price, visanaMedDirect_priceSubtitle, visanaMedDirect_feature1, visanaMedDirect_feature2, visanaMedDirect_feature3, visanaPlanDeSanteViva_price, visanaPlanDeSanteViva_priceSubtitle, visanaPlanDeSanteViva_feature1, visanaPlanDeSanteViva_feature2, visanaPlanDeSanteViva_feature3, visanaTelCare_price, visanaTelCare_priceSubtitle, visanaTelCare_feature1, visanaTelCare_feature2, visanaTelCare_feature3, visanaTelDoc_price, visanaTelDoc_priceSubtitle, visanaTelDoc_feature1, visanaTelDoc_feature2, visanaTelDoc_feature3, visperterminenKkAssuranceDeBase_price, visperterminenKkAssuranceDeBase_priceSubtitle, visperterminenKkAssuranceDeBase_feature1, visperterminenKkAssuranceDeBase_feature2, visperterminenKkAssuranceDeBase_feature3, visperterminenKkCasamed_price, visperterminenKkCasamed_priceSubtitle, visperterminenKkCasamed_feature1, visperterminenKkCasamed_feature2, visperterminenKkCasamed_feature3, visperterminenKkMedicasa_price, visperterminenKkMedicasa_priceSubtitle, visperterminenKkMedicasa_feature1, visperterminenKkMedicasa_feature2, visperterminenKkMedicasa_feature3, visperterminenKkTelmed_price, visperterminenKkTelmed_priceSubtitle, visperterminenKkTelmed_feature1, visperterminenKkTelmed_feature2, visperterminenKkTelmed_feature3".split(
      ", "
    ),
  ];