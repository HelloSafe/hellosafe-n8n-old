import IInput from "./interfaces/IInput";

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
  if (input.amount > 100000000) {
    throw new Error("The amount is too big");
  }
  if (input.language !== "fr" && input.language !== "nl") {
    throw new Error("This node only support language fr and nl for now");
  }
  return true;
}
