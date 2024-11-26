export function getMonthly(rate: number, amount: number, duration: number) {
  return (amount * rate) / 12 / (1 - Math.pow(1 + rate / 12, -duration));
}

export function getInterest(monthly: number, duration: number, amount: number) {
  return monthly * duration - amount;
}
