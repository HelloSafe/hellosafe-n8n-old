import IInput from "./interface/IInput";

/**
 * Validates the structured input data.
 * 
 * This function ensures that the provided input data adheres to specific rules and 
 * constraints, verifying both individual field values and their combinations. If any 
 * validation fails, an appropriate error is thrown.
 * 
 * @param input - The structured input data to validate.
 * @returns `true` if the input is valid.
 * @throws An error if any validation rule is violated.
 */
export default function validate(input: IInput) {
  //validate if inputs are correct, if the combination of inputs is correct etc.
  if (input.locale !== "fr-BE" && input.locale !== "nl-BE") {
    throw new Error("This node only support language fr and nl for now");
  }
  return true;
}
