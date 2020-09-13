import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class AssetMonitoringService {

  url = environment.metrics;

  private rxWindowItem = new BehaviorSubject(null);
  rxWindowValue: Observable<any> = this.rxWindowItem.asObservable();


  /**
   * Selected widget data for view in drill downpage.
   * ex : {}
   */
  private rxSelectedWiget = new BehaviorSubject(null);
  rxWigetVale: Observable<any> = this.rxSelectedWiget.asObservable();



  private rxSelectedDevices = new BehaviorSubject(null);
  rxDevices: Observable<any> = this.rxSelectedDevices.asObservable();


  /**
   * Observable for Store the RTM chart onClick of Tab data
   */
  private rxChartRaw = new BehaviorSubject(null);
  rxchartRawData: Observable<any> = this.rxChartRaw.asObservable();

  /**
   * Observable for Store the MatSidenav state open/close
   */
  private rxMatSidenav = new BehaviorSubject(null);
  rxMatSidenavState: Observable<any> = this.rxMatSidenav.asObservable();


  constructor(private http: HttpClient) { }

  onGetRealtimeData() {
    return this.http.get('/assets/json/mock.rtm.json');
  }
  /**
   *
   * @param item : Its an array list consist of Test, values keys,
   * Which has the values of window time that selecte in Asset monitoring sidenav
   *
   */
  onRxUpdateWindowItem(item) {
    this.rxWindowItem.next(item);
  }


  /**
   * @param deviceIds Choosen devices id from the Metric tree view
   */
  onRxTreeDevices(deviceIds: string[]) {
    this.rxSelectedDevices.next(deviceIds);
  }


  /**
   *
   * @param val : Update the obserable as Selected widget values like  : {assetId:.., asetName:..}
   */
  onRXUWigetValue(val: any) {
    this.rxSelectedWiget.next(val);
  }

  /**
   * @param urlName last name of the API (metric name)
   * @param fromTime From Date & Time
   * @param toTime To Date & time
   * @param deviceIds Devices id's
   * @param reportType Type of report needed such as [ total, minute, hour, day, week]
   */
  getAPIMetric(urlName: string, fromTime: number, toTime: number, deviceIds: string[], reportType: string) {
    const payload = {
      fts: fromTime,
      ts: toTime,
      devices: deviceIds,
      type: reportType,
    };
    // return this.http.post(`${this.url}/metrics/${urlName}`, payload);
    return this.http.post(`${this.url}metrics/${urlName}`, payload).pipe(catchError(err => this.handleError(err)));
    // return this.http.get(this.url + '/test')
  }


  getFavMachines() {
    return this.http.get(this.url + 'metrics/fav').pipe(catchError(err => this.handleError(err)));
  }

  /**
   *
   * @param devIds Devcices ids
   * @param mWindow Metric window that was seleted
   */
  putFavmachiens(payload: { devices?: string[], metricWindow?: { value: number, text: string } }) {
    return this.http.put(this.url + 'metrics/updateFav', payload)
      .pipe(catchError(err => this.handleError(err)));
  }

  /** Error Handler */
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }



  /**
   * @list consist of data, type, from time and to time
   * @param res This comes from api raw and sencond one is
   * @param type  Type of report [total, hour, week, day] want to show as label in chart
   * @param from from time
   * @param to To time
   * @param pageName Page name where chart has been utilized
   */
  onRXChartRawData(res: any, type: string, from: number, to: number, path: string, assetType: string) {
    if (res && res.data) {
      this.rxChartRaw.next({ data: res, reportInterval: type, fst: from, ts: to, pageName: path, assetCategory: assetType });
    } else {
      this.rxChartRaw.next(null);
    }
  }

  /**
   * 
   * @param timetype : report type - present, past
   * @param metricWindowValue : metric value like (L7D, L30D, L3M)
   */
  onSetTime(timetype: string, metricWindowValue: string) {
    let fromtime;
    let toTime;
    if (timetype === 'present') {
      fromtime = moment().startOf('day').valueOf();
      toTime = moment().endOf('day').valueOf();
    } else {
      if (metricWindowValue) {

        /** Note : Not including current day */
        toTime = moment().subtract(1, 'day').endOf('day').valueOf();
        const windowVal = metricWindowValue;
        let dt = moment().valueOf();
        switch (windowVal) {
          case 'L7D': dt = moment().subtract(7, 'day').startOf('day').valueOf(); break;
          case 'L30D': dt = moment().subtract(30, 'day').startOf('day').valueOf(); break;
          case 'L3M': dt = moment().subtract(3, 'month').subtract(1, 'day').startOf('day').valueOf(); break;
          case 'L1Y': dt = moment().subtract(1, 'year').subtract(1, 'day').valueOf(); break;
          case 'lifetime': dt = moment('1990-01-01 00:00:00').valueOf(); break;
        }
        fromtime = dt;
      }
    }
    return { fst: fromtime, ts: toTime };
  }

  RXUpdateMatSidenavState(value: boolean) {
    this.rxMatSidenav.next(value);
  }


}
