import Pipeline from "../MortgageBE/Pipeline";

describe("HealthInsuranceCH", () => {
    let instance: Pipeline;
  
    beforeEach(() => {
      // Create a new instance of MyClass before each test.
      instance = new Pipeline();
    });
  
    test("it should pass with filter settings 1", async () => {

      const input = {
        age: "Adult (26 years and above)",
        postalCode: "Fribourg 1700",
        accidentCover: "false",
        franchise: "300 CHF",
        model: "Family doctor / choice",
        locale: "en-CH",
      };
      try {
        await instance.execute(input, []);
      } catch (e) {
        expect(false);
      }
      expect(true);
    });

    test("it shouldn't pass with filter settings 2", async () => {

      const input = {
        age: "Adult (26 years and above)",
        postalCode: "Fribourg 1700",
        accidentCover: "false",
        franchise: "300 CHF",
        model: "Family doctor / choice",
        locale: "en-FR",
      };

      try {
        await instance.execute(input, []);
      } catch (e) {
        expect(true);
      }
      expect(false);
    });
});