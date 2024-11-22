import { JWT } from "google-auth-library";
import { google } from "googleapis";

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

export function createStructFromSheet(array: any) {
  const headers = array[0];
  const len = headers.length;
  const res: any = [];

  // array is array of lines
  for (let elem of array) {
    const row: any = {};
    for (let i = 0; i < len; i++) {
      // Pushing into the row like {header1: value1}
      row[headers[i]] = elem[i];
    }
    // Then push the row to the res to have [{row1}, {row2}, ..]
    res.push(row);
  }

  return res;
}

// Load the spreadsheet
export async function loadSpeadsheetInfo(spreadsheetId: string, rangesInput: string[]) {
  const sheets = google.sheets({ version: "v4", auth: serviceAccountAuth });

  // Creating the range for the batch request, loop on all sheet, asking rang
  const ranges = rangesInput;
  const response = await sheets.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges,
  });

  const res: any = {};

  // Create our reponse looping on the batch response
  const sheetsArray = response?.data?.valueRanges ?? [];
  sheetsArray.map((buff, i) => {
    res[rangesInput[i].split("!")[0]] = createStructFromSheet(buff.values);
  });
  return res;
}
