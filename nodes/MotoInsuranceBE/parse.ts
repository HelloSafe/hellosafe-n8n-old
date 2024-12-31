import IInput from "./interfaces/IInput";
/**
 * Parses raw input data into a structured format.
 * 
 * This function takes a raw input object and transforms it into a well-defined 
 * structure by applying default values and parsing logic as needed. It ensures
 * the resulting object adheres to the expected format of the target interface.
 * 
 * @param rawInputs - An object containing unstructured input data.
 * @returns A promise that resolves to the structured and validated input object.
 */
export async function parse(inputsRaw: any): Promise<IInput> {
    const type = inputsRaw.type ?? "50 cc";
    const spreadsheetId = "1Liyd4BNBtOGCDGzXRqTgCtN2DraiU4TzWa8TFsgrSWw";

    let sheetName: string = 'price NL';
    if (inputsRaw.locale === 'fr-BE') {
        sheetName = 'price';
    }

    sheetName = sheetName + "!A:AA";

    return {
        spreadsheetId: spreadsheetId,
        sheetName: sheetName,
        type: type,
    };
}
