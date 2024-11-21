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