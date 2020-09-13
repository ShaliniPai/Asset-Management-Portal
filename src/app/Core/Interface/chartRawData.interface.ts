export interface IFchartRawData {
    data: { data: any, timeZone: string };
    reportInterval: string;
    fst: number;
    ts: number;
    pageName: string;
    assetCategory?: string;
}
