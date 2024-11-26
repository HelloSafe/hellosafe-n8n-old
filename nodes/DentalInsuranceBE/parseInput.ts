export function parseInput(inputs: any) {
  const age = parseInt(inputs.age) ?? 30;

  const nl_province = ["Vlaanderen", "Brussel", "Wallonië"];

  const fr_province = ["Flandre", "Bruxelles", "Wallonie"];

  let province = "";

  // Setting the province name, as the one in the Gsheet, to be multi-language
  if (nl_province.includes(inputs.province)) {
    const idx = nl_province.indexOf(inputs.province);
    province = fr_province[idx];
  } else {
    if (fr_province.includes(inputs.province)) {
      province = inputs.province;
    }
  }
  return {
    'age': age,
    'province': province
  };
}
