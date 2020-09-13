import { Component, OnInit } from '@angular/core';
import { ClassAMWidget } from 'src/app/Core/Class/class-widget-AssetMoni';
import { AssetMonitoringService } from 'src/app/Core/Service/asset-monitoring.service';
import * as  moment from 'moment';
import { Router } from '@angular/router';
import { ExportAsService } from 'src/app/Core/Service/export-as.service';
import { RbSpinnerService } from 'src/app/Core/Service/rb-spinner.service';
import * as momentTz from 'moment-timezone';
@Component({
  selector: 'app-monitoring-charts',
  templateUrl: './monitoring-charts.component.html',
  styleUrls: ['./monitoring-charts.component.scss']
})
export class MonitoringChartsComponent implements OnInit {
  windowList: any;
  windowTime = 'L30D';
  pastTabGroupIndex = 0;
  currentTabGroupIndex = 1;
  selectedWidget: ClassAMWidget;
  tabName;
  timezoneName;
  countListen = 0;
  chartDatasets: { fts: number, ts: number, devices: string[], type: string };

  tabInfo = { type: 'present', index: 1, tabLabel: '' };

  listMetricWindow: any[] = [
    { value: 'L7D', text: 'Last 7 days' },
    { value: 'L30D', text: 'Last 30 days' },
    { value: 'L3M', text: 'Last 3 months' },
  ];
  constructor(
    private self$: AssetMonitoringService,
    private router: Router,
    private exportAs$: ExportAsService,
    private spinner: RbSpinnerService
  ) { }


  /* istanbul ignore next */
  ngOnInit() {
    // this.timezoneName = momentTz.tz.add('UTC 05:30').guess();
    /** * Capture the Window time  & sidenav state from rxjs observable */
    this.self$.rxWindowValue.subscribe(res => {
      if (res) {
        this.windowList = res;
      }
      // console.log('WindowList: ' + JSON.stringify(res));
    });

    this.self$.rxWigetVale.subscribe((res: any) => {
      if (res) {
        this.selectedWidget = res;
        if (this.countListen === 0) {
          this.onTabChanges('present', { index: 1, tab: { textLabel: 'Utilization' } });
          this.countListen++;
        }
        //  console.log('Selected Widget data: ' + JSON.stringify(res));
      }
    });
  }


  /**
   * * /// SRS ID: FD_IMPL_PCE_3_10.4
   * @param t : Type of tab selection either Current Day/ Past days
   * @param ev : Event that is been trigger after selection
   */
  onTabChanges(t: string, ev: any) {
    /// Note : We need to check whether index 0 called as it call even close as it call double time (tab move to another),
    /// As a result it cause us to doble click when moveing b/w tab groups
    this.spinner.onRBSpinner$(true);
    if (ev.index !== 0) {
      this.tabInfo = { type: t, index: ev.index, tabLabel: ev.tab.textLabel };
      // console.log(ev);
      const index = ev.index;
      this.tabName = ev.tab.textLabel;
      let reportInterval = 'hour';
      if (t === 'present') {
        this.pastTabGroupIndex = 0;
        this.currentTabGroupIndex = ev.index;
      } else {
        this.pastTabGroupIndex = ev.index;
        this.currentTabGroupIndex = 0;
        reportInterval = 'day';
      }




      let path = 'util';
      switch (index) {
        case 1: path = 'util'; break;/* istanbul ignore next */
        case 2: path = 'floorTrip'; break;/* istanbul ignore next */
        case 3: path = 'energy'; break;/* istanbul ignore next */
        case 4: path = 'peakUsage'; reportInterval = 'day'; break;/* istanbul ignore next */
        case 5: path = 'peakUsage'; reportInterval = 'hour'; break;
      }

      this.self$.onRXChartRawData([], '', 0, 0, '', '');
      if (this.selectedWidget && this.windowList && this.selectedWidget.did && this.windowList['value']) {
        const time = this.self$.onSetTime(t, this.windowTime);

        /**
         * Decide data how it requried wether, day, hour, weekly
         */

        if (path !== 'peakUsage') {
          const timediff = moment(time.ts).diff(time.fst, 'days');
          if (timediff > 30) {
            reportInterval = 'week';
          }
        }
        // time.fst = 1581445800000;
        // time.ts = 1581532199000;
        //  this.self$.getAPIMetric(path, time.fst, time.ts, [this.selectedWidget.did], reportInterval).subscribe(
        this.self$.getAPIMetric(path, time.fst, time.ts, [this.selectedWidget.did], reportInterval)
          .subscribe(
            (data: any[]) => {
              // peak usage
              // data = {"data":[{"floor":11,"trip":12,"device":"99999031","hour":"08","dayNo":"6"},{"floor":32,"trip":34,"device":"99999031","hour":"23","dayNo":"7"},{"floor":76,"trip":76,"device":"99999031","hour":"09","dayNo":"3"},{"floor":70,"trip":70,"device":"99999031","hour":"17","dayNo":"3"},{"floor":64,"trip":64,"device":"99999031","hour":"18","dayNo":"3"},{"floor":62,"trip":62,"device":"99999031","hour":"10","dayNo":"3"},{"floor":61,"trip":61,"device":"99999031","hour":"15","dayNo":"3"},{"floor":55,"trip":55,"device":"99999031","hour":"13","dayNo":"3"},{"floor":54,"trip":54,"device":"99999031","hour":"19","dayNo":"3"},{"floor":52,"trip":52,"device":"99999031","hour":"14","dayNo":"3"},{"floor":52,"trip":52,"device":"99999031","hour":"12","dayNo":"3"},{"floor":39,"trip":39,"device":"99999031","hour":"11","dayNo":"3"},{"floor":36,"trip":36,"device":"99999031","hour":"16","dayNo":"3"},{"floor":26,"trip":26,"device":"99999031","hour":"20","dayNo":"3"},{"floor":17,"trip":17,"device":"99999031","hour":"07","dayNo":"3"},{"floor":15,"trip":15,"device":"99999031","hour":"21","dayNo":"3"}],"timeZone":"+05:30"};
              // utilization
              // data ={"data":[{"active":0,"idle":0,"down":21,"shutdown":0,"slow":0,"device":"99999045","date":"2020-02-27 13:00:00"},{"active":0,"idle":0,"down":50,"shutdown":0,"slow":0,"device":"99999045","date":"2020-02-27 12:00:00"},{"active":0,"idle":0,"down":50,"shutdown":0,"slow":0,"device":"99999045","date":"2020-02-27 11:00:00"},{"active":0,"idle":0,"down":50,"shutdown":0,"slow":0,"device":"99999045","date":"2020-02-27 10:00:00"},{"active":0,"idle":0,"down":50,"shutdown":0,"slow":0,"device":"99999045","date":"2020-02-27 09:00:00"},{"active":0,"idle":0,"down":50,"shutdown":0,"slow":0,"device":"99999045","date":"2020-02-27 08:00:00"},{"active":0,"idle":0,"down":0,"shutdown":0,"slow":0,"device":"99999045","date":"2020-02-27 07:00:00"},{"active":0,"idle":0,"down":49,"shutdown":0,"slow":0,"device":"99999045","date":"2020-02-27 06:00:00"},{"active":0,"idle":0,"down":48,"shutdown":0,"slow":0,"device":"99999045","date":"2020-02-27 05:00:00"},{"active":0,"idle":0,"down":49,"shutdown":0,"slow":0,"device":"99999045","date":"2020-02-27 04:00:00"},{"active":0,"idle":0,"down":49,"shutdown":0,"slow":0,"device":"99999045","date":"2020-02-27 03:00:00"},{"active":0,"idle":0,"down":49,"shutdown":0,"slow":0,"device":"99999045","date":"2020-02-27 02:00:00"},{"active":0,"idle":0,"down":49,"shutdown":0,"slow":0,"device":"99999045","date":"2020-02-27 01:00:00"},{"active":0,"idle":0,"down":50,"shutdown":0,"slow":0,"device":"99999045","date":"2020-02-27 00:00:00"}],"timeZone":"+05:30"};
              this.self$.onRXChartRawData(data, reportInterval, time.fst, time.ts, path, this.selectedWidget.type);
              this.spinner.onRBSpinner$(false);
            }, error => {
              console.log(error);
              this.spinner.onRBSpinner$(false);
            });
        this.router.navigate([`/home/monitoring/details/${path}`]);
      }
    }
  }


  /// Change event : Metric Window time
  onChangeMetricWindow() {
    if (this.pastTabGroupIndex !== 0) {
      this.onTabChanges('past', { index: this.tabInfo.index, tab: { textLabel: this.tabInfo.tabLabel } });
    }
  }


  /** Download chart */
  onClick_saveAsImage() {
    const title = this.selectedWidget.assetName + '-' + this.tabName;
    this.exportAs$.fs_exportAsImageJPEG(title, document.getElementById('id_ConvertImage'));
  }

  onReturnPDFTitle() {
    return (this.selectedWidget.assetName + '_' + this.tabName + '.pdf').toString();
  }

  onDisableTab() {
    if (this.selectedWidget && (this.selectedWidget.type).toLowerCase() === 'elevator') {
      return false;
    }
    return true;
  }
}
