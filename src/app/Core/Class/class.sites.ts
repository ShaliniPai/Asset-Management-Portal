import { Time } from '@angular/common';

export class ClassSites {
    _id: string;
    zone: string;
    siteName: string;
    des: string;
    loc: string;
    timezone: string;
    wifiSSID: string;
    wifiPassword: string;
    zid: string;
    opHours: {
        weekdays: {
            days: [],
            time: { from: { hh: number, mm: number, meridiem: string }, to: { hh: number, mm: number, meridiem: string } }
        }
        weekend: {
            days: [],
            time: { from: { hh: number, mm: number, meridiem: string }, to: { hh: number, mm: number, meridiem: string } }
        }
    };

    constructor(res: any) {
        this._id = res._id;
        this.zone = res.zone;
        this.siteName = res.siteName;
        this.des = res.des;
        this.loc = res.loc;
        this.timezone = res.timezone;
        this.wifiSSID = res.wifiSSID;
        this.wifiPassword = res.wifiPassword;
        this.opHours = res.opHours;
        this.zid = res.zid;
        // this.opHours.weekdays.days = res.opHours.weekdays.days;
        // this.opHours.weekdays.time.from.hh = res.opHours.weekdays.time.from.hh;
        // this.opHours.weekdays.time.from.mm = res.opHours.weekdays.time.from.mm;
        // this.opHours.weekdays.time.from.meridiem = res.opHours.weekdays.time.from.meridiem;

        // this.opHours.weekend.days = res.opHours.weekend.days;
        // this.opHours.weekend.time.from.hh = res.opHours.weekend.time.from.hh;
        // this.opHours.weekend.time.from.mm = res.opHours.weekend.time.from.mm;
        // this.opHours.weekend.time.from.meridiem = res.opHours.weekend.time.from.meridiem;
    }
}
