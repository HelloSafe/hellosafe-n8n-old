import { formatDuration } from "./utils";

export function processData(parsedInputs: any, spreadSheet:any) {
    // Matching row on the duration filter value
    const matchingRows = spreadSheet["rates_BE NEW!A:E"].filter((row: any) => {
      return row["$duration"] === formatDuration(parsedInputs.duration);
    });
    return {
      ...parsedInputs,
      'matchingRows': matchingRows
    }
}