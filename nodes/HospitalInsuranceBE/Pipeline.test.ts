import Pipeline from "./Pipeline";

describe("HospitalInsuranceBE", () => {
  let instance: Pipeline;

  beforeEach(() => {
    // Create a new instance of MyClass before each test.
    instance = new Pipeline();
  });

  test("it should pass with filter settings 1", async () => {
    const input = {
      province: 'Flandre',
      age: '49',
      locale: 'fr-BE',
      spreadsheetId: "14GwCuDUNWbNKA2AakqMU-3u5IPxxEtT1vwIOLVxJ1CE",
      sheetName: "price_settings_test (endpoint)",
    };

    const outputList = [
      "offer1_price",
    ]

    const expectedOutput = {
      offer1_price: '241,50 €',
    };

    const result = await instance.execute(input, outputList);

    expect(result[0].json).toStrictEqual(expectedOutput);
  });

  test("To old test case", async () => {
    const input = {
      province: 'Flandre',
      age: '101',
      locale: 'fr-BE',
      spreadsheetId: "14GwCuDUNWbNKA2AakqMU-3u5IPxxEtT1vwIOLVxJ1CE",
      sheetName: "price_settings_test (endpoint)",
    };

    const outputList = [
      "offer1_price",
    ]

    try {

        await instance.execute(input, outputList);
    } catch(e) {
        expect(true);
    }
    expect(false);
  });

  test("wrong province", async () => {
    const input = {
      province: 'unknow',
      age: '42',
      locale: 'fr-BE',
      spreadsheetId: "14GwCuDUNWbNKA2AakqMU-3u5IPxxEtT1vwIOLVxJ1CE",
      sheetName: "price_settings_test (endpoint)",
    };

    const outputList = [
      "offer1_price",
    ]

    try {

        await instance.execute(input, outputList);
    } catch(e) {
        expect(true);
    }
    expect(false);
  });

  test("Locale input wrong", async () => {
    const input = {
      province: 'Flandre',
      age: '42',
      locale: 'fr-CH',
      spreadsheetId: "14GwCuDUNWbNKA2AakqMU-3u5IPxxEtT1vwIOLVxJ1CE",
      sheetName: "price_settings_test (endpoint)",
    };

    const outputList = [
      "offer1_price",
    ]

    try {

        await instance.execute(input, outputList);
    } catch(e) {
        expect(true);
    }
    expect(false);
  });
});
