import IInput from "./interfaces/IInput";

export async function parset(inputsRaw: any): Promise<IInput> {
    const locale = inputsRaw?.locale ?? "fr-BE";
    const type = inputsRaw.type ?? "50 cc";
    const spreadsheetId = "1Liyd4BNBtOGCDGzXRqTgCtN2DraiU4TzWa8TFsgrSWw";

    const sheetIds: any = { "fr-BE": "price", "nl-BE": "price NL" }; //fr, nl

    [`${parsedInput.sheetIds[parsedInput.locale]}!A:AA` ]

    return {
        'type': type,
        'locale': locale,
        'sheetIds': sheetIds,
    };
}
