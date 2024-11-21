export function getMonthly(total: number, duration: number) {
    console.log(total, total / (duration * 12), duration * 12, "DA");
    const bruh = duration * 12;
    console.log(total / bruh);
  return (total / (duration * 12)).toFixed(2);
}

export function getRate(row: any) {
  if (row["Rates"] === "0.00") {
    return null;
  }
  return parseFloat(row["Rates"]);
}

export function getTotal(amount: number, rate: number) {
  console.log(rate / 100, "RATE");
  console.log(amount, amount * (rate / 100));
  return amount + amount * (rate / 100);
}

export function roundToNearest05(value: number) {
  let rounded = Math.round(value * 20);

  return rounded / 20;
}
