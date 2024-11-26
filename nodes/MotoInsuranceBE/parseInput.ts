export function parseInput(inputs: any) {
    const locale = inputs?.locale ?? "fr-BE";
    const type = inputs.type ?? "50 cc";
    const sheetIds: any = { "fr-BE": "price", "nl-BE": "price NL" }; //fr, nl

    return {
        'type': type,
        'locale': locale,
        'sheetIds': sheetIds,
    };
}
