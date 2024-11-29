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
      spreadsheetId: "10G1YmwdawjYjkIIPLcBFQeLPKSTPQwP2C-lskvImArc",
      sheetName: "TEST_rates_BE[DO_NOT_DELETE]",
    };
    const outputList = [
      "offer1_price",
      "offer1_priceSubtitle",
      "offer1_feature1",
      "offer1_feature2",
      "offer1_feature3",
      "offer2_price",
      "offer2_priceSubtitle",
      "offer2_feature1",
      "offer2_feature2",
      "offer2_feature3",
    ]

    const expectedOutput = {
      offer1_price: '1 155,97 €',
      offer1_feature1: '8 074 €',
      offer1_feature2: '208 074 €',
      offer1_feature3: '4,037 %',
      offer2_price: '1 160,33 €',
      offer2_feature1: '8 860 €',
      offer2_feature2: '208 860 €',
      offer2_feature3: '4,43 %'
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
      spreadsheetId: "10G1YmwdawjYjkIIPLcBFQeLPKSTPQwP2C-lskvImArc",
      sheetName: "TEST_rates_BE[DO_NOT_DELETE]",
    };
    const outputList = [
      "offer1_price",
      "offer1_priceSubtitle",
      "offer1_feature1",
      "offer1_feature2",
      "offer1_feature3",
      "offer2_price",
      "offer2_priceSubtitle",
      "offer2_feature1",
      "offer2_feature2",
      "offer2_feature3",
    ]

    const expectedOutput = {
      offer1_price: '346,65 €',
      offer1_feature1: '3 995 €',
      offer1_feature2: '103 995 €',
      offer1_feature3: '3,995 %',
      offer2_price: '348,17 €',
      offer2_feature1: '4 450 €',
      offer2_feature2: '104 450 €',
      offer2_feature3: '4,45 %'
    };

    const result = await instance.execute(input, outputList);

    expect(result[0].json).toStrictEqual(expectedOutput);
  });
});
