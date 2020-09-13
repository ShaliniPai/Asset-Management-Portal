import { Component, OnInit } from '@angular/core';
import { AssetMonitoringService } from 'src/app/Core/Service/asset-monitoring.service';
import { IFutilChartRaw } from 'src/app/Core/Interface/utilChartRawData.interface';
import { IFchartRawData } from 'src/app/Core/Interface/chartRawData.interface';
import { Label } from 'ng2-charts';
import { ChartOptions, ChartDataSets } from 'chart.js';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-utilization',
  templateUrl: './utilization.component.html',
  styleUrls: ['./utilization.component.scss']
})
export class UtilizationComponent implements OnInit {

  constructor(private $self: AssetMonitoringService, private router: Router) { }

  tzName;
  rawData: IFutilChartRaw[];
  timeZone;
  barChartLabels: Label[];
  DatasetsConfig: IFChartExtendDatasets[];
  barChatDatasets: IFChartExtendDatasets[];
  barChartOptions: ChartOptions;
  maxChartUnits = 60; // 60 minutes
  reportType;
  assetCategory;
  ngOnInit() {
    /// Get Data from respective api's
    this.$self.rxchartRawData.subscribe((res: IFchartRawData) => {
      const url = this.router.url;
      console.log(url);
      /* istanbul ignore next */
      if (res && res.data && url.includes('util')) {
        this.rawData = res.data.data;
        this.timeZone = res.data.timeZone;
        this.reportType = res.reportInterval;
        this.assetCategory = res.assetCategory;
        console.log('Asset Type > ...' + this.assetCategory);

        this.barChartLabels = this.OnLabels(res.fst, res.ts, this.timeZone, res.reportInterval);
        this.onTrimDataTOMaxUnits();
        this.onChartOptions();
        this.onAccumulateData();
      }
    });
  }

  OnLabels(fromtime: number, toTime: number, timeZone: string, reportInterval: any) {
    const labels = [];
    if (reportInterval === 'hour' || reportInterval === 'day' || reportInterval === 'week') {
      this.maxChartUnits = 60;
      if (reportInterval === 'day') {
        this.maxChartUnits = 1440;
      } else if (reportInterval === 'week') {
        this.maxChartUnits = 1440 * 7;
      }
      const timeDiff = moment(toTime).diff(fromtime, reportInterval);
      for (let i = 0; i <= timeDiff; i++) {
        let time;
        if (reportInterval === 'week') {
          time = moment(fromtime).day('Sunday').week((+moment(fromtime).format('W')) + i + 1).valueOf();
        } else {
          time = moment(fromtime).add(reportInterval, i).valueOf(); // .format(dateFormat);
        }
        labels.push(time);
      }
    }
    return labels;
  }

  /* istanbul ignore next */
  onAccumulateData() {
    /**
     * Note :  This level of hierarchy has to be same
     */
    if (this.assetCategory.toLowerCase() === 'elevator') {
      this.DatasetsConfig = [
        { label: 'Active time', backgroundColor: '#78BE20', data: [], maxBarThickness: 40, columnName: 'active' },
        { label: 'Idle time', backgroundColor: '#f9ad17', data: [], maxBarThickness: 40, columnName: 'idle' },
        { label: 'Downtime', backgroundColor: '#E20015', data: [], maxBarThickness: 40, columnName: 'down' },
        // { label: 'Shutdown time', backgroundColor: '#460dc1', data: [], maxBarThickness: 40, columnName: 'shutdown' }
      ];
    } else {
      this.DatasetsConfig = [
        { label: 'Active time', backgroundColor: '#78BE20', data: [], maxBarThickness: 40, columnName: 'active' },
        { label: 'Idle time', backgroundColor: '#f9ad17', data: [], maxBarThickness: 40, columnName: 'idle' },
        { label: 'Slow', backgroundColor: '#f5bac4', data: [], maxBarThickness: 40, columnName: 'slow' },
        { label: 'Downtime', backgroundColor: '#E20015', data: [], maxBarThickness: 40, columnName: 'down' },
        // { label: 'Shutdown time', backgroundColor: '#460dc1', data: [], maxBarThickness: 40, columnName: 'shutdown' }
      ];
    }

    this.DatasetsConfig.forEach((ele: IFChartExtendDatasets) => {
      this.barChartLabels.forEach(label => {
        let dateFormat = 'YYYY-MM-DD HH:mm:ss';

        if (this.reportType === 'week') {
          dateFormat = 'YYYY-WW';
        }
        const fitlerLabel = moment(label).utcOffset(this.timeZone).format(dateFormat);
        const val = this.rawData.find(element => fitlerLabel === element.date);

        const isBefore = moment(label).isBefore(moment().valueOf());
        const diff = moment().diff(moment(label).valueOf(), 'minutes');
        /// Stretch up the down time remaining minutes
        let colVal = 0;
        if (ele.columnName.toLowerCase() === 'down' && !val && isBefore === true) {
          colVal = this.maxChartUnits;
          /// Need to trim the vlaues as per current time
          if (diff < this.maxChartUnits) {
            colVal = diff > 0 ? diff : 0;
          } else {
            colVal = this.maxChartUnits;
          }
        } else {
          colVal = val && val[ele.columnName] ? val[ele.columnName] : 0;
        }
        ele.data.push(colVal);
      });
    });

    // this.barChartLabels.forEach((row, index) => {
    //   let count = 0;
    //   this.DatasetsConfig.forEach(dataset => {
    //     this = dataset.data[index];
    //   });
    // });

    this.barChatDatasets = [... this.DatasetsConfig];
  }

  onChartOptions() {
    const YaxisTicks = { beginAtZero: true, max: this.maxChartUnits, min: 0, stepSize: 10 };
    if (this.reportType === 'week') {
      YaxisTicks.stepSize = 1680;
    } else if (this.reportType === 'day') {
      YaxisTicks.stepSize = 240;
    }
    this.barChartOptions = {
      maintainAspectRatio: false,
      tooltips: {
        callbacks: {
          label: (tooltipItem) => {
            return tooltipItem.value + ' Mins';
          },
          title: ((title: any) => {
            return this.chartCBTimeFormat(title[0]['xLabel']);
          })
        }
      },
      layout: { padding: { right: 5, left: 0, bottom: 20 } },
      legend: { display: true, position: 'top', labels: { usePointStyle: false, boxWidth: 10 } },
      hover: { mode: null },
      scales: {
        yAxes: [{
          display: true, stacked: true,
          gridLines: { display: true }, ticks: YaxisTicks,
          scaleLabel: {
            display: true,
            labelString: 'Duration (Minutes)',
            fontFamily: 'Roboto,sans-serif', fontSize: 14, fontColor: '#657c93'
          }
        }
        ],
        xAxes: [
          {
            stacked: true,
            display: true, gridLines: { display: false },
            ticks: {
              display: true, minRotation: 90,
              callback: (value, index) => {
                return this.chartCBTimeFormat(+value);
              }
            },

          },
          {
            offset: true,
            gridLines: {
              display: false,
              drawOnChartArea: false,
              drawTicks: true,
              drawBorder: false, color: '#fff'
            },
            ticks: {
              // autoSkip: false,
              display: this.reportType === 'hour' ? true : false,
              maxRotation: 0,
              minRotation: 0,
              callback: (value, index, list: any[]) => {
                const cd = moment(value).utcOffset(this.timeZone).format('DD / MMM');
                if (index === 0 || (list[index - 1] && moment(list[index - 1]).utcOffset(this.timeZone).format('DD / MMM') !== cd)) {
                  return cd;
                }
                return null;

              }
            }
          },

        ]
      }
    };
  }

  chartCBTimeFormat(value) {
    if (this.reportType === 'day') {
      return moment(value).utcOffset(this.timeZone).format('D / MMM');
    } else if (this.reportType === 'week') {
      const week = +moment(value).utcOffset(this.timeZone).format('W');
      const year = +moment(value).utcOffset(this.timeZone).format('YYYY');
      const sd = moment().day('Sunday').week(week).year(year).format('D/MMM');
      const ed = moment().day('Saturday').week(week).year(year).format('D/MMM');

      const SDsplit = sd.split('/');
      const EDsplit = ed.split('/');
      if (SDsplit[1] === EDsplit[1]) {
        return `${SDsplit[0]} - ${EDsplit[0]} / ${SDsplit[1]}`;
      }
      return `${sd} - ${ed}`;
    } else {
      return moment(value).utcOffset(this.timeZone).format('hh:mm A');
    }
  }

  /**
   * There are two scenarios will this function will conver
   * 1. If any values exceeds the maxUnits then, it auto set the values at max  before are after sum
   */
  onTrimDataTOMaxUnits() {
    if (this.assetCategory.toLowerCase() === 'elevator') {
      this.rawData.forEach(ele => {
        let active = ele.active;
        let idle = ele.idle;
        let down = ele.down;
        let unit = 0;
        /// Need to trim the vlaues as per current time
        let diff = moment().diff(moment(ele.date).valueOf(), 'minutes');
        if (this.reportType === 'week') {
          const splitweek = ele.date.split('-');
          // console.log(moment().utcOffset(this.timeZone).day('Sunday').week(+splitweek[1]).year(+splitweek[0]).format('LLL'), splitweek);
          diff = moment().diff(moment().utcOffset(this.timeZone).day('Sunday').week(+splitweek[1]).year(+splitweek[0]).valueOf(), 'minutes');
        }
        if (diff < this.maxChartUnits) {
          unit = diff > 0 ? diff : 0;
        } else {
          unit = this.maxChartUnits;
        }

        if (active < unit) {
          const i = idle + active;
          if (i < unit) {
            down = unit - i;
            // if (d < unit) {
            //   shutdown = unit - d;
            // } else {
            //   down = unit - i;
            //   shutdown = 0;
            // }
          } else {
            idle = unit - active;
            down = 0;
            // shutdown = 0;
          }
        } else {
          active = unit;
          idle = 0;
          down = 0;
          // shutdown = 0;
        }
        ele.active = active;
        ele.idle = idle;
        ele.down = down;
        // ele.shutdown = shutdown;
      });
    } else {
      this.onTrimDataTOMaxUnitsEsclator();
    }
  }

  /**
   * There are two scenarios will this function will conver
   * 1. If any values exceeds the maxUnits then, it auto set the values at max  before are after sum
   *//* istanbul ignore next */
  onTrimDataTOMaxUnitsEsclator() {
    this.rawData.forEach(ele => {
      let active = ele.active;
      let idle = ele.idle;
      let slow = ele.slow;
      let down = ele.down;
      // let shutdown = ele.shutdown;
      let unit = 0;
      /// Need to trim the vlaues as per current time
      let diff = moment().diff(moment(ele.date).valueOf(), 'minutes');
      if (this.reportType === 'week') {
        const splitweek = ele.date.split('-');
        // console.log(moment().utcOffset(this.timeZone).day('Sunday').week(+splitweek[1]).year(+splitweek[0]).format('LLL'), splitweek);
        diff = moment().diff(moment().utcOffset(this.timeZone).day('Sunday').week(+splitweek[1]).year(+splitweek[0]).valueOf(), 'minutes');
      }
      if (diff < this.maxChartUnits) {
        unit = diff > 0 ? diff : 0;
      } else {
        unit = this.maxChartUnits;
      }

      if (active < unit) {
        const i = idle + active;
        if (i < unit) {
          const s = slow + i;
          if (s < unit) {
            down = unit - s;
            // if (d < unit) {
            //   shutdown = unit - d;
            // } else {
            //   down = unit - s;
            //   shutdown = 0;
            // }
          } else {
            slow = unit - i;
            down = 0;
            // shutdown = 0;
          }

        } else {
          idle = unit - active;
          down = 0;
          // shutdown = 0;
          slow = 0;
        }
      } else {
        active = unit;
        idle = 0;
        down = 0;
        // shutdown = 0;
        slow = 0;
      }
      ele.active = active;
      ele.idle = idle;
      ele.slow = slow;
      ele.down = down;
      // ele.shutdown = shutdown;
    });
  }

}


export interface IFChartExtendDatasets extends ChartDataSets {
  columnName?: string;
}
