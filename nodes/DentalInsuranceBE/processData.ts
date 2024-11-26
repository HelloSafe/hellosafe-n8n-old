import getRowsMatchingAge from "../../srcs/utils/getRowsMatchingAge";

export function processData(parsedInputs: any, externalData: any): any {
  const filteredRows = getRowsMatchingAge(
    externalData["prices!A:J"],
    parsedInputs.age,
    "age"
  );
  return {
    ...parsedInputs,
    filteredRows: filteredRows,
  };
}