export default interface IProcessedData {
    pricesRows: {
        name: string;
        logoSubtitle: string;
        price: number;
        priceSubtitle: string;
    }[];
    locale: string;
};