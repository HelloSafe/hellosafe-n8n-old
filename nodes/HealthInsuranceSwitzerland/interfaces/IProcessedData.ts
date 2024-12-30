export default interface IProcessedData {
  isDollarVersion: boolean;
  offersInfo: {
    name: string;
    price: number;
  }[];
}
