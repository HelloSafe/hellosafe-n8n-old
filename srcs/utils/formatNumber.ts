export function formatNumber(result: number, language: string, before: string = "", after: string = "", defaultWhenZero: string = "NC", decimal: number | null = 0) {
  if (result) {
    if (decimal === null) {
      return before + result.toLocaleString(language) + after;
    }
    return before + result.toLocaleString(language, {
        minimumFractionDigits: decimal,
        maximumFractionDigits: decimal,
      }) + after;
  }
  return defaultWhenZero;
}