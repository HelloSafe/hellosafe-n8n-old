import axios from "axios";

export async function processData(parsedInputs: any, spreadSheet: any) {
  const apiKey = process.env.SUPABASE_CLIENT_ANON_KEY ?? "";
  let url =
    "https://pnbpasamidjpaqxsprtm.supabase.co/rest/v1/data_pret_personel?select=*&amount=lte." +
    parsedInputs.amount +
    "&limit=1" +
    "&durationSlider=eq." +
    parsedInputs.duration;

  // We make the request, firstly to get the amount, from the approximation inputed
  let response = await axios.get(url, {
    headers: { apiKey: apiKey, Authorization: `Bearer ${apiKey}` },
  });

  parsedInputs.amount = response.data[0].amount;
  parsedInputs.duration = response.data[0].durationSlider;

  //Then we fetch again, with the exact closest amount value
  url =
    "https://pnbpasamidjpaqxsprtm.supabase.co/rest/v1/data_pret_personel?select=*&amount=eq." +
    parsedInputs.amount +
    "&durationSlider=eq." +
    parsedInputs.duration;

  response = await axios.get(url, {
    headers: { apiKey: apiKey, Authorization: `Bearer ${apiKey}` },
  });
  return {
    ...parsedInputs,
    'priceList': response.data,
  };
}
