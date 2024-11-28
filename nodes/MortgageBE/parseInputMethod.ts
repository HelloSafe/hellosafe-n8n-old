import IInputType from "./IInputType";
import IParsedInput from "./IParsedInput";

export default async function parseInputMethod(inputs: IInputType): Promise<IParsedInput> {
    const duration = inputs.duration ?? "10";
    const amount = parseInt(inputs.amount) ?? 100000;
    const type = inputs.type ?? "Fixe";
    const country = inputs.locale == "fr-BE" ? "FR" : "NL";

    return {
      duration: duration,
      amount: amount,
      type: type,
      country: country,
    };
  }
