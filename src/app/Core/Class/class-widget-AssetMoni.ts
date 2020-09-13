import { AfterViewInit } from '@angular/core';

export class ClassAMWidget {

    assetId: string;
    assetName: string;
    type: string;
    status: string;
    floors: any;
    trips: any;
    util: number;
    downtime: number;
    energy: number;
    /// RowSpan : This filed will update Daynamically for expend widget
    rowSpan: number;
    timezone: string;
    did: string;
    floorsDay: any;
    tripsDay: any;
    peakHour: any;
    peakDay: any;
    energyDay: number;

    metricWindow?: {
        floors: any;
        trips: any;
        util: number;
        downtime: number;
        energy: number;
        floorsDay: any;
        tripsDay: any;
        peakHour: string;
        peakDay: string;
        energyDay: number;
    };
    constructor(res: any, reportType?: string) {

        /*  if (reportType && reportType === 'past') {
              this.metricWindow.floorsDay = res.floorsDay;
              this.metricWindow.peakHour = res.peakHour;
              this.metricWindow.peakDay = res.peakDay;
              this.metricWindow.tripsDay = res.tripsDay;
              this.metricWindow.energyDay = res.energyDay;
              this.metricWindow.floors = res.floors;
              this.metricWindow.trips = res.trips;
              this.metricWindow.downtime = res.downtime;
              this.metricWindow.energy = res.energy;
       //   } else {
           */
        this.assetId = res.assetId;
        this.assetName = res.assetName;
        this.type = res.type;
        this.status = res.status;
        this.floors = this.onCheckMachineType(res.type, res.floors);
        this.trips = this.onCheckMachineType(res.type, res.trips);
        this.downtime = this.onRoundToThousand(res.downtime);
        this.energy = this.onRoundToThousand(+ res.energy.toFixed(2));
        this.rowSpan = 1;
        this.util = this.onRoundPercent(res.util);
        this.timezone = res.timezone;
        this.did = res.did;
        this.floorsDay = this.onCheckMachineType(res.type, res.floorsDay);
        this.peakHour = this.onCheckMachineType(res.type, res.peakHour || '-');
        this.peakDay = this.onCheckMachineType(res.type, res.peakDay || '-');
        this.tripsDay = this.onCheckMachineType(res.type, res.tripsDay);
        this.energyDay = this.onRoundToThousand(res.energyDay);

    }
    onRoundPercent(value) {
        let i = 0;
        if (value) {
            i = value > 100 ? 100 : (value < 0 ? 0 : value);
        }
        return i;
    }

    onCheckMachineType(type: string, value: number) {
        if (type && type.toLowerCase() === 'elevator') {
            return this.onRoundToThousand(value);
        }
        return '-';

    }

    onRoundToThousand(value: any) {
        let k = value;
        if (value && !isNaN(value)) {
            if (value > 9999) {

                let decimals = 0;
                let unit = 'k';
                let denominator = 1000;
                if (value > 9999 && value < 99999) {
                    decimals = 2;
                } else if (value > 99999 && value < 999999) {
                    decimals = 1;
                } else if (value > 999999 && value < 9999999) {
                    decimals = 0;
                } else if (value > 9999999) {
                    unit = 'L';
                    decimals = 2;
                    denominator = 100000;
                }
                k = (value / denominator).toFixed(decimals);
                return k + unit;
            }
        }
        return k;
    }
}
