import isDefinedAndNotEmpty from "../../srcs/utils/isDefinedAndNotEmpty";

export default function validate(inputs: any) {
  if (
    !isDefinedAndNotEmpty(inputs.duration) ||
    !isDefinedAndNotEmpty(inputs.amount) ||
    !isDefinedAndNotEmpty(inputs.type) ||
    !isDefinedAndNotEmpty(inputs.locale)
  ) {
    return false;
  }
  return true;
}
