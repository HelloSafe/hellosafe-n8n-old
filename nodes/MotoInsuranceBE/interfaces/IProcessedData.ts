export default interface IProcessedData {
    language: string;
    rateSettings: {
        name: string,
        rate: number,
        total: number,
        interest: number,
        monthly: number,
    }[];
}