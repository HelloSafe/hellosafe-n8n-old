import getRowsMatchingAge from "../../srcs/utils/getRowsMatchingAge";

export async function processData(parsedInputs: any, spreadSheet:any) {
    // We filter the rows on age range
    const matchingAgeRows = getRowsMatchingAge(
      spreadSheet["price_settings!A:H"],
      parsedInputs.age,
      "age"
    );

    // Then on the province depending on the language
    const matchingFilterRows = matchingAgeRows.filter(
      (row) => row["province"] === parsedInputs.province || row["provinceNL"] === parsedInputs.province
    );
    return {
        ...parsedInputs,
        'matchingFilterRows': matchingFilterRows,
    }
}