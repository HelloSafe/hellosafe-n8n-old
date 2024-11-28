import IParsedInput from "./IParsedInput";

export default interface IProcessedData {
    originalInput: IParsedInput;
    matchingRows: any[];
}