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
  // Could be a parameter of the node
    const province = ["bruxelles", "flandre", "wallonie"];
  //validate if inputs are correct, if the combination of inputs is correct etc.
  if (input.locale !== "fr-BE" && input.locale !== "nl-BE") {
    throw new Error("This node only support language fr and nl for now");
  } 
  if (input.age > 100 || input.age < 1) {
    throw new Error("Age must be between 1 and 100");
  }

  if (!province.includes(input.province.toLocaleLowerCase())) {
    throw new Error("Wrong province input");
  }
  return true;
}
