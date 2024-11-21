export function getMonthly(total: number, duration: number) {
  return (total / (duration * 12)).toFixed(2);
}

export function getRate(row: any, durationKey: string) {
  if (row[durationKey] === "0.00") {
    return null;
  }
  return parseFloat(row[durationKey]);
}

export function getTotal(amount: number, rate: number) {
  return amount + amount * (rate / 100);
}

export function roundToNearest05(value: number) {
  let rounded = Math.round(value * 20);

  return rounded / 20;
}
