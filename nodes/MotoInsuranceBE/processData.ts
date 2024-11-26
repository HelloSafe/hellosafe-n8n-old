export function processData(parsedInputs: any, spreadSheet: any) {
  const priceSheetRow =
    spreadSheet[`${parsedInputs.sheetIds[parsedInputs.locale]}!A:AA`];
  const headersValue = priceSheetRow[0];

  const priceList: any = priceSheetRow.filter((row: any, i: number) => {
    return row["type"] == parsedInputs.type;
  });

  return {
    ...parsedInputs,
    'headersValue': headersValue,
    'priceList': priceList,
  };
}
