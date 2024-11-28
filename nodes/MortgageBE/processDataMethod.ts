import { loadSpeadsheetInfo } from "../../srcs/utils/accessSpreadsheet";
import IParsedInput from "./IParsedInput";
import { formatDuration } from "./utils";

export default async function processDataMethod(input: IParsedInput) {
    const spreadSheet = await loadSpeadsheetInfo(
      "10G1YmwdawjYjkIIPLcBFQeLPKSTPQwP2C-lskvImArc",
      ["rates_BE NEW!A:E"]
    );
    const matchingRows = spreadSheet["rates_BE NEW!A:E"].filter((row: any) => {
        return row["$duration"] === formatDuration(input.duration);
      });
      return {
        originalInput: input,
        matchingRows: matchingRows,
      }
}