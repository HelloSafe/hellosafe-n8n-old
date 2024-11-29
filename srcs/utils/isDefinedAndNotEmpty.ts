export default function isDefinedAndNotEmpty(variable: any) {
  return (
    variable !== undefined &&
    variable !== null &&
    ((typeof variable === "string" && variable.trim() !== "") ||
      (Array.isArray(variable) && variable.length > 0) ||
      (typeof variable === "object" && Object.keys(variable).length > 0) ||
      (typeof variable === "number" && !isNaN(variable)))
  );
}
