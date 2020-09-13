import { Time } from '@angular/common';

export interface IFhourPeakChartRaw {
    floor: number;
    trip: number;
    device: string;
    hour: number;
    dayNo: number;
}

export interface IFdayPeakChartRaw {
    floor: number;
    trip: number;
    device: string;
    hour: Time;
}