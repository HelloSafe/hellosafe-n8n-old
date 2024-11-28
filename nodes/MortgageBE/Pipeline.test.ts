import Pipeline from "./Pipeline";

describe("MortgageBE", () => {
  let instance: Pipeline;

  beforeEach(() => {
    // Create a new instance of MyClass before each test.
    instance = new Pipeline();
  });

  test("it should pass with filter settings 1", async () => {
    const input = {
      duration: "15",
      amount: "200000",
      type: "Fixe",
      locale: "fr-BE",
    };
    const outputList =
      "axa_price, axa_priceSubtitle, axa_feature1, axa_feature2, axa_feature3, belfius_price, belfius_priceSubtitle, belfius_feature1, belfius_feature2, belfius_feature3, dsp_price, dsp_priceSubtitle, dsp_feature1, dsp_feature2, dsp_feature3, creditBrokers_price, creditBrokers_priceSubtitle, creditBrokers_feature1, creditBrokers_feature2, creditBrokers_feature3, ing_price, ing_priceSubtitle, ing_feature1, ing_feature2, ing_feature3, bnpParibas_price, bnpParibas_priceSubtitle, bnpParibas_feature1, bnpParibas_feature2, bnpParibas_feature3, crelan_price, crelan_priceSubtitle, crelan_feature1, crelan_feature2, crelan_feature3, recordCredits_price, recordCredits_priceSubtitle, recordCredits_feature1, recordCredits_feature2, recordCredits_feature3, argenta_price, argenta_priceSubtitle, argenta_feature1, argenta_feature2, argenta_feature3, allianz_price, allianz_priceSubtitle, allianz_feature1, allianz_feature2, allianz_feature3, ebLease_price, ebLease_priceSubtitle, ebLease_feature1, ebLease_feature2, ebLease_feature3, kbc_price, kbc_priceSubtitle, kbc_feature1, kbc_feature2, kbc_feature3, elantis_price, elantis_priceSubtitle, elantis_feature1, elantis_feature2, elantis_feature3, cbc_price, cbc_priceSubtitle, cbc_feature1, cbc_feature2, cbc_feature3, beobank_price, beobank_priceSubtitle, beobank_feature1, beobank_feature2, beobank_feature3, keytradeBank_price, keytradeBank_priceSubtitle, keytradeBank_feature1, keytradeBank_feature2, keytradeBank_feature3, creafin_price, creafin_priceSubtitle, creafin_feature1, creafin_feature2, creafin_feature3, fintro_price, fintro_priceSubtitle, fintro_feature1, fintro_feature2, fintro_feature3, cph_price, cph_priceSubtitle, cph_feature1, cph_feature2, cph_feature3, triodos_price, triodos_priceSubtitle, triodos_feature1, triodos_feature2, triodos_feature3, helloBank_price, helloBank_priceSubtitle, helloBank_feature1, helloBank_feature2, helloBank_feature3, nagelmackers_price, nagelmackers_priceSubtitle, nagelmackers_feature1, nagelmackers_feature2, nagelmackers_feature3, andrass_price, andrass_priceSubtitle, andrass_feature1, andrass_feature2, andrass_feature3".split(
        ", "
      );

    const expectedOutput = {
      belfius_price: "1 155,97 €",
      belfius_feature1: "8 074 €",
      belfius_feature2: "208 074 €",
      belfius_feature3: "4,037 %",
      ing_price: "1 160,33 €",
      ing_feature1: "8 860 €",
      ing_feature2: "208 860 €",
      ing_feature3: "4,43 %",
      bnpParibas_price: "1 167,78 €",
      bnpParibas_feature1: "10 200 €",
      bnpParibas_feature2: "210 200 €",
      bnpParibas_feature3: "5,1 %",
      crelan_price: "1 163,33 €",
      crelan_feature1: "9 400 €",
      crelan_feature2: "209 400 €",
      crelan_feature3: "4,7 %",
      keytradeBank_price: "1 143,56 €",
      keytradeBank_feature1: "5 840 €",
      keytradeBank_feature2: "205 840 €",
      keytradeBank_feature3: "2,92 %",
      axa_price: "1 164,33 €",
      axa_feature1: "9 580 €",
      axa_feature2: "209 580 €",
      axa_feature3: "4,79 %",
      argenta_price: "1 157,78 €",
      argenta_feature1: "8 400 €",
      argenta_feature2: "208 400 €",
      argenta_feature3: "4,2 %",
      elantis_price: "1 145,56 €",
      elantis_feature1: "6 200 €",
      elantis_feature2: "206 200 €",
      elantis_feature3: "3,1 %",
      kbc_price: "1 163,89 €",
      kbc_feature1: "9 500 €",
      kbc_feature2: "209 500 €",
      kbc_feature3: "4,75 %",
      cbc_price: "1 163,89 €",
      cbc_feature1: "9 500 €",
      cbc_feature2: "209 500 €",
      cbc_feature3: "4,75 %",
      beobank_price: "1 163,00 €",
      beobank_feature1: "9 340 €",
      beobank_feature2: "209 340 €",
      beobank_feature3: "4,67 %",
      nagelmackers_price: "1 161,67 €",
      nagelmackers_feature1: "9 100 €",
      nagelmackers_feature2: "209 100 €",
      nagelmackers_feature3: "4,55 %",
      triodos_price: "1 159,44 €",
      triodos_feature1: "8 700 €",
      triodos_feature2: "208 700 €",
      triodos_feature3: "4,35 %",
      fintro_price: "1 167,78 €",
      fintro_feature1: "10 200 €",
      fintro_feature2: "210 200 €",
      fintro_feature3: "5,1 %",
      andrass_price: "1 160,00 €",
      andrass_feature1: "8 800 €",
      andrass_feature2: "208 800 €",
      andrass_feature3: "4,4 %",
      helloBank_price: "1 162,44 €",
      helloBank_feature1: "9 240 €",
      helloBank_feature2: "209 240 €",
      helloBank_feature3: "4,62 %",
      cph_price: "1 165,56 €",
      cph_feature1: "9 800 €",
      cph_feature2: "209 800 €",
      cph_feature3: "4,9 %",
      dsp_price: "1 145,56 €",
      dsp_feature1: "6 200 €",
      dsp_feature2: "206 200 €",
      dsp_feature3: "3,1 %",
      recordCredits_price: "NC",
      recordCredits_feature1: "NC",
      recordCredits_feature2: "NC",
      recordCredits_feature3: "NC",
      creditBrokers_price: "1 146,44 €",
      creditBrokers_feature1: "6 360 €",
      creditBrokers_feature2: "206 360 €",
      creditBrokers_feature3: "3,18 %",
      allianz_price: "1 153,33 €",
      allianz_feature1: "7 600 €",
      allianz_feature2: "207 600 €",
      allianz_feature3: "3,8 %",
      creafin_price: "1 165,00 €",
      creafin_feature1: "9 700 €",
      creafin_feature2: "209 700 €",
      creafin_feature3: "4,85 %",
      ebLease_price: "NC",
      ebLease_feature1: "NC",
      ebLease_feature2: "NC",
      ebLease_feature3: "NC",
    };

    const result = await instance.execute(input, outputList);

    expect(result[0].json).toStrictEqual(expectedOutput);
  });
  test("it should pass with filter settings 2", async () => {
    const input = {
      duration: "25",
      amount: "100000",
      type: "Fixe",
      locale: "fr-BE",
    };
    const outputList =
      "axa_price, axa_priceSubtitle, axa_feature1, axa_feature2, axa_feature3, belfius_price, belfius_priceSubtitle, belfius_feature1, belfius_feature2, belfius_feature3, dsp_price, dsp_priceSubtitle, dsp_feature1, dsp_feature2, dsp_feature3, creditBrokers_price, creditBrokers_priceSubtitle, creditBrokers_feature1, creditBrokers_feature2, creditBrokers_feature3, ing_price, ing_priceSubtitle, ing_feature1, ing_feature2, ing_feature3, bnpParibas_price, bnpParibas_priceSubtitle, bnpParibas_feature1, bnpParibas_feature2, bnpParibas_feature3, crelan_price, crelan_priceSubtitle, crelan_feature1, crelan_feature2, crelan_feature3, recordCredits_price, recordCredits_priceSubtitle, recordCredits_feature1, recordCredits_feature2, recordCredits_feature3, argenta_price, argenta_priceSubtitle, argenta_feature1, argenta_feature2, argenta_feature3, allianz_price, allianz_priceSubtitle, allianz_feature1, allianz_feature2, allianz_feature3, ebLease_price, ebLease_priceSubtitle, ebLease_feature1, ebLease_feature2, ebLease_feature3, kbc_price, kbc_priceSubtitle, kbc_feature1, kbc_feature2, kbc_feature3, elantis_price, elantis_priceSubtitle, elantis_feature1, elantis_feature2, elantis_feature3, cbc_price, cbc_priceSubtitle, cbc_feature1, cbc_feature2, cbc_feature3, beobank_price, beobank_priceSubtitle, beobank_feature1, beobank_feature2, beobank_feature3, keytradeBank_price, keytradeBank_priceSubtitle, keytradeBank_feature1, keytradeBank_feature2, keytradeBank_feature3, creafin_price, creafin_priceSubtitle, creafin_feature1, creafin_feature2, creafin_feature3, fintro_price, fintro_priceSubtitle, fintro_feature1, fintro_feature2, fintro_feature3, cph_price, cph_priceSubtitle, cph_feature1, cph_feature2, cph_feature3, triodos_price, triodos_priceSubtitle, triodos_feature1, triodos_feature2, triodos_feature3, helloBank_price, helloBank_priceSubtitle, helloBank_feature1, helloBank_feature2, helloBank_feature3, nagelmackers_price, nagelmackers_priceSubtitle, nagelmackers_feature1, nagelmackers_feature2, nagelmackers_feature3, andrass_price, andrass_priceSubtitle, andrass_feature1, andrass_feature2, andrass_feature3".split(
        ", "
      );

    const expectedOutput = {
      belfius_price: "346,65 €",
      belfius_feature1: "3 995 €",
      belfius_feature2: "103 995 €",
      belfius_feature3: "3,995 %",
      ing_price: "348,17 €",
      ing_feature1: "4 450 €",
      ing_feature2: "104 450 €",
      ing_feature3: "4,45 %",
      bnpParibas_price: "350,83 €",
      bnpParibas_feature1: "5 250 €",
      bnpParibas_feature2: "105 250 €",
      bnpParibas_feature3: "5,25 %",
      crelan_price: "349,27 €",
      crelan_feature1: "4 780 €",
      crelan_feature2: "104 780 €",
      crelan_feature3: "4,78 %",
      keytradeBank_price: "343,43 €",
      keytradeBank_feature1: "3 030 €",
      keytradeBank_feature2: "103 030 €",
      keytradeBank_feature3: "3,03 %",
      axa_price: "349,43 €",
      axa_feature1: "4 830 €",
      axa_feature2: "104 830 €",
      axa_feature3: "4,83 %",
      argenta_price: "348,10 €",
      argenta_feature1: "4 430 €",
      argenta_feature2: "104 430 €",
      argenta_feature3: "4,43 %",
      elantis_price: "343,67 €",
      elantis_feature1: "3 100 €",
      elantis_feature2: "103 100 €",
      elantis_feature3: "3,1 %",
      kbc_price: "349,60 €",
      kbc_feature1: "4 880 €",
      kbc_feature2: "104 880 €",
      kbc_feature3: "4,88 %",
      cbc_price: "349,73 €",
      cbc_feature1: "4 920 €",
      cbc_feature2: "104 920 €",
      cbc_feature3: "4,92 %",
      beobank_price: "349,37 €",
      beobank_feature1: "4 810 €",
      beobank_feature2: "104 810 €",
      beobank_feature3: "4,81 %",
      nagelmackers_price: "348,17 €",
      nagelmackers_feature1: "4 450 €",
      nagelmackers_feature2: "104 450 €",
      nagelmackers_feature3: "4,45 %",
      triodos_price: "347,83 €",
      triodos_feature1: "4 350 €",
      triodos_feature2: "104 350 €",
      triodos_feature3: "4,35 %",
      fintro_price: "350,83 €",
      fintro_feature1: "5 250 €",
      fintro_feature2: "105 250 €",
      fintro_feature3: "5,25 %",
      andrass_price: "348,00 €",
      andrass_feature1: "4 400 €",
      andrass_feature2: "104 400 €",
      andrass_feature3: "4,4 %",
      helloBank_price: "349,50 €",
      helloBank_feature1: "4 850 €",
      helloBank_feature2: "104 850 €",
      helloBank_feature3: "4,85 %",
      cph_price: "350,00 €",
      cph_feature1: "5 000 €",
      cph_feature2: "105 000 €",
      cph_feature3: "5 %",
      dsp_price: "343,67 €",
      dsp_feature1: "3 100 €",
      dsp_feature2: "103 100 €",
      dsp_feature3: "3,1 %",
      recordCredits_price: "NC",
      recordCredits_feature1: "NC",
      recordCredits_feature2: "NC",
      recordCredits_feature3: "NC",
      creditBrokers_price: "344,13 €",
      creditBrokers_feature1: "3 240 €",
      creditBrokers_feature2: "103 240 €",
      creditBrokers_feature3: "3,24 %",
      allianz_price: "346,00 €",
      allianz_feature1: "3 800 €",
      allianz_feature2: "103 800 €",
      allianz_feature3: "3,8 %",
      creafin_price: "349,50 €",
      creafin_feature1: "4 850 €",
      creafin_feature2: "104 850 €",
      creafin_feature3: "4,85 %",
      ebLease_price: "NC",
      ebLease_feature1: "NC",
      ebLease_feature2: "NC",
      ebLease_feature3: "NC",
    };

    const result = await instance.execute(input, outputList);

    expect(result[0].json).toStrictEqual(expectedOutput);
  });

  test("it should fail with wrong input", async () => {
    const input = {
      amount: "100000",
      type: "Fixe",
      locale: "fr-BE",
    };
  
    await expect(instance.execute(input, [])).rejects.toThrow("Wrong input");
  });
});
