import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

// Doc: https://theoephraim.github.io/node-google-spreadsheet/#/
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
    "1Liyd4BNBtOGCDGzXRqTgCtN2DraiU4TzWa8TFsgrSWw",
    serviceAccountAuth
  );

  await doc.loadInfo(); // loads document properties and worksheets
  return doc;
}

export const outputList =
  "dvvRc_price, dvvRc_priceSubtitle, dvvRc_feature1, dvvRc_feature2, dvvRc_feature3, yuzzuRc_price, yuzzuRc_priceSubtitle, yuzzuRc_feature1, yuzzuRc_feature2, yuzzuRc_feature3, yuzzuMiniOmnium_price, yuzzuMiniOmnium_priceSubtitle, yuzzuMiniOmnium_feature1, yuzzuMiniOmnium_feature2, yuzzuMiniOmnium_feature3, cbcRc_price, cbcRc_priceSubtitle, cbcRc_feature1, cbcRc_feature2, cbcRc_feature3, kbcRc_price, kbcRc_priceSubtitle, kbcRc_feature1, kbcRc_feature2, kbcRc_feature3, axaRc_price, axaRc_priceSubtitle, axaRc_feature1, axaRc_feature2, axaRc_feature3, axaMiniOmnium_price, axaMiniOmnium_priceSubtitle, axaMiniOmnium_feature1, axaMiniOmnium_feature2, axaMiniOmnium_feature3, axaOmnium_price, axaOmnium_priceSubtitle, axaOmnium_feature1, axaOmnium_feature2, axaOmnium_feature3, agRc_price, agRc_priceSubtitle, agRc_feature1, agRc_feature2, agRc_feature3, agMiniOmnium_price, agMiniOmnium_priceSubtitle, agMiniOmnium_feature1, agMiniOmnium_feature2, agMiniOmnium_feature3, agOmnium_price, agOmnium_priceSubtitle, agOmnium_feature1, agOmnium_feature2, agOmnium_feature3, belfiusRc_price, belfiusRc_priceSubtitle, belfiusRc_feature1, belfiusRc_feature2, belfiusRc_feature3, belfiusMiniOmnium_price, belfiusMiniOmnium_priceSubtitle, belfiusMiniOmnium_feature1, belfiusMiniOmnium_feature2, belfiusMiniOmnium_feature3, viviumRc_price, viviumRc_priceSubtitle, viviumRc_feature1, viviumRc_feature2, viviumRc_feature3, viviumMiniOmnium_price, viviumMiniOmnium_priceSubtitle, viviumMiniOmnium_feature1, viviumMiniOmnium_feature2, viviumMiniOmnium_feature3, viviumOmnium_price, viviumOmnium_priceSubtitle, viviumOmnium_feature1, viviumOmnium_feature2, viviumOmnium_feature3, p&vRc_price, p&vRc_priceSubtitle, p&vRc_feature1, p&vRc_feature2, p&vRc_feature3, p&vMiniOmnium_price, p&vMiniOmnium_priceSubtitle, p&vMiniOmnium_feature1, p&vMiniOmnium_feature2, p&vMiniOmnium_feature3, p&vOmnium_price, p&vOmnium_priceSubtitle, p&vOmnium_feature1, p&vOmnium_feature2, p&vOmnium_feature3, acmInsuranceRc_price, acmInsuranceRc_priceSubtitle, acmInsuranceRc_feature1, acmInsuranceRc_feature2, acmInsuranceRc_feature3, acmInsuranceMiniOmnium_price, acmInsuranceMiniOmnium_priceSubtitle, acmInsuranceMiniOmnium_feature1, acmInsuranceMiniOmnium_feature2, acmInsuranceMiniOmnium_feature3, acmInsuranceOmnium_price, acmInsuranceOmnium_priceSubtitle, acmInsuranceOmnium_feature1, acmInsuranceOmnium_feature2, acmInsuranceOmnium_feature3, federaleRc_price, federaleRc_priceSubtitle, federaleRc_feature1, federaleRc_feature2, federaleRc_feature3, ethiasRc_price, ethiasRc_priceSubtitle, ethiasRc_feature1, ethiasRc_feature2, ethiasRc_feature3, aedesRc_price, aedesRc_priceSubtitle, aedesRc_feature1, aedesRc_feature2, aedesRc_feature3, argentaRc_price, argentaRc_priceSubtitle, argentaRc_feature1, argentaRc_feature2, argentaRc_feature3".split(
    ", "
  );
