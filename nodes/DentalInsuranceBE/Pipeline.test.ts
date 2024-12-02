import Pipeline from "./Pipeline";

describe("DentalInsuranceBE", () => {
  let instance: Pipeline;

  beforeEach(() => {
    // Create a new instance of MyClass before each test.
    instance = new Pipeline();
  });

  test("it should pass with filter settings 1", async () => {
    const input = {
      age: '10',
      province: 'Wallonie',
      spreadsheetId: "1oEfQKYKA49gTSNmWGI_nsuzaPs-MbP_4nbUI8xQVn10",
      sheetName: "price_test_endpoint",
    };
    const outputList = [
      "offer1_price",
      "offer2_price",
    ]

    const expectedOutput = {
      offer2_price: '5,14 €',
    };

    const result = await instance.execute(input, outputList);

    expect(result[0].json).toStrictEqual(expectedOutput);
  });
  test("test wrong age", async () => {
    const input = {
      age: '101',
      province: 'Wallonie',
      spreadsheetId: "1oEfQKYKA49gTSNmWGI_nsuzaPs-MbP_4nbUI8xQVn10",
      sheetName: "price_test_endpoint",
    };
    const outputList = [
      "offer1_price",
      "offer2_price",
    ]

    try {

      await instance.execute(input, outputList);
    } catch(e) {
      expect(true);
    }
    expect(false);
  });
});
