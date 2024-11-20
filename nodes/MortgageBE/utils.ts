export function formatDuration(duration: string) {
  switch (duration) {
    case "10":
      return "10";
    case "13":
      return "10-13";
    case "15":
      return "13-15";
    case "18":
      return "15-18";
    case "20":
      return "18-20";
    case "25":
      return "20-25";
    case "30":
      return "25-30";
    default:
      return "10";
  }
}

export function getMonthly(total: number, duration: number) {
  return (total / duration / 12);
}

export function getRate(row: any, type: string) {
  if (type === "Fixe" || type === "Vast") {
    if (row["fixedRate"] === "NC") {
      return null;
    }
    return parseFloat(row["fixedRate"].replace(",", ".").replace("%", ""));
  } else {
    if (row["variableRate"] === "NC") {
      return null;
    }
    return parseFloat(row["variableRate"].replace(",", ".").replace("%", ""));
  }
}

export function getTotal(amount: number, rate: number) {
  return amount + amount * (rate / 100);
}
