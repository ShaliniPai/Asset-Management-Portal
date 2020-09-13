import { Component, OnInit } from '@angular/core';
import { AssetMonitoringService } from 'src/app/Core/Service/asset-monitoring.service';
import { IFutilChartRaw } from 'src/app/Core/Interface/utilChartRawData.interface';
import { IFchartRawData } from 'src/app/Core/Interface/chartRawData.interface';
import { Label } from 'ng2-charts';
import { ChartOptions, ChartDataSets } from 'chart.js';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-peak-usage',
  templateUrl: './peak-usage.component.html',
  styleUrls: ['./peak-usage.component.scss']
})
export class PeakUsageComponent implements OnInit {

  constructor(private $self: AssetMonitoringService, private router: Router) { }
  weekType = ["weekday", "weekend"];
  tzName;
  rawData: IFutilChartRaw[];
  timeZone;
  barChartLabels: Label[];
  DatasetsConfig: IFChartExtendDatasets[];
  barChatDatasets: IFChartExtendDatasets[];
  barChartOptions: ChartOptions;
  labelConfig: number[];
  reportType;
  fromTime: number;
  toTime: number;
  /** Week Days */
  dayNumbers: number[] = [1, 2, 3, 4, 5, 6, 7];
  assetName;
  ngOnInit() {
    /// Get Data from respective api's
    this.$self.rxchartRawData.subscribe((res: IFchartRawData) => {
      const url = this.router.url;
      console.log(url);
      /* istanbul ignore next */
      if (res && res.data && url.includes('peakUsage')) {
        this.rawData = res.data.data;
        // this.reportType.
        this.timeZone = res.data.timeZone;
        this.reportType = res.reportInterval;
        this.fromTime = res.fst;
        this.toTime = res.ts;
        this.barChartLabels = this.OnLabels(res.reportInterval);
        // this.barChartLabels = ['A', 'B', 'C'];
        // this.
        console.log('Peak Chart Label : ' + JSON.stringify(this.barChartLabels));
        this.onChartOptions();
        // this.rawData = this.onPeakGroupBy
        this.onAccumulateData();
      }
    });
  }

  OnLabels(reportInterval: any) {
    let labels = [];
    if (reportInterval === 'hour' || reportInterval === 'day' || reportInterval === 'week') {

      if (reportInterval === 'day') {
        labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        this.labelConfig = [1, 2, 3, 4, 5, 6, 7];
      } else {
        for (let index = 1; index <= 23; index++) {
          const time = moment('1990-01-01 00:00:00').add(index, 'hour').valueOf();
          labels.push(time);
          this.labelConfig = labels;
        }
      }
    }
    return labels;
  }

  /* istanbul ignore next */
  onAccumulateData() {
    /**
     * Note :  This level of hierarchy has to be same
     */
    this.DatasetsConfig = [
      { label: 'Avg number of floors', backgroundColor: '#78BE20', data: [], maxBarThickness: 40, columnName: 'floor', categoryPercentage: this.reportType === 'day' ? 0.4 : 1.0 },
      { label: 'Avg number of trips', backgroundColor: '#460dc1', data: [], maxBarThickness: 40, columnName: 'trip', categoryPercentage: this.reportType === 'day' ? 0.4 : 1.0 },
    ];

    this.DatasetsConfig.forEach((ele: IFChartExtendDatasets) => {
      this.labelConfig.forEach(label => {
        let val;
        let listOfHours = [];
        let colVal;

        let denominator = 1;
        if (this.reportType === 'day') {
          val = this.rawData.find(element => label === +element.dayNo);
          denominator = this.getDaysBetweenDates(label === 7 ? 0 : label).length;
          colVal = val && val[ele.columnName] ? val[ele.columnName] : 0;
        } else {
          const tempWeekType = [];
          this.dayNumbers.forEach(dayno => {
            const dayNoFilter = this.rawData.filter(list => +list.dayNo === +dayno);
            dayNoFilter.forEach(dayList => {
              tempWeekType.push(dayList);
            });
          });
          const fitlerLabel = moment(label).utcOffset(this.timeZone).format('HH');
          listOfHours = tempWeekType.filter(hour => hour.hour === fitlerLabel);
          if (listOfHours.length > 0) {
            val = listOfHours.map(mapele => mapele[ele.columnName]).reduce((a, b) => a + b);
          } else {
            val = 0;
          }
          colVal = val ? val : 0;
          const diff = moment(this.toTime).diff(this.fromTime, 'days');
          denominator = diff + 1;
        }
        // console.log('Denominator Vlaue : ' + denominator, label === 7 ? 0 : label);
        /**
         * Peakusage day or hour = Average we need to consider 
         * i.e totalNumber of floor or Trips / Number of dayNumber or hours
         * here Daynumber will come bases on number of times repeated particual dayNuber over period of time and
         * particular hour number times been repeated on specified time
         */
        ele.data.push(Math.round(colVal / denominator));
      });
    });
    this.barChatDatasets = [... this.DatasetsConfig];
  }

  onChartOptions() {
    this.barChartOptions = {
      maintainAspectRatio: false,
      tooltips: {
        callbacks: {
          // label: (tooltipItem) => {
          //   return tooltipItem.value;
          // },
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
          display: true,
          gridLines: { display: true }, ticks: { beginAtZero: true, min: 0 },
          scaleLabel: {
            display: true,
            labelString: 'Average number of floors & trips',
            fontFamily: 'Roboto,sans-serif', fontSize: 14, fontColor: '#657c93'
          }
        }
        ],
        xAxes: [{
          display: true, gridLines: { display: false },
          ticks: {
            display: true, minRotation: this.reportType === 'day' ? 0 : 90,
            callback: (value, index) => {
              return this.chartCBTimeFormat(value);
            }
          },

        }]
      }
    };
  }

  /// Graph Config-label and tooltips
  chartCBTimeFormat(value) {
    if (this.reportType === 'hour') {
      return moment(+value).utcOffset(this.timeZone).format('hh:mm A');
    }
    return value;
  }
  /**
   * Toggle between the weekend and weekdays in terms of hours
   */
  onSelectWeektype(value: string[]) {
    if (value && value.length > 0) {
      if (value && value.length === 2) {
        this.dayNumbers = [1, 2, 3, 4, 5, 6, 7];
      } else if (value.length === 1) {
        if (value[0] === 'weekday') {
          this.dayNumbers = [1, 2, 3, 4, 5];
        } else {
          this.dayNumbers = [6, 7];
        }
      }
    } else {
      this.dayNumbers = [];
    }

    this.onAccumulateData();
  }


  getDaysBetweenDates(dayNumber) {
    const result = [];
    // const days = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
    // var day = days[dayName.toLowerCase().substr(0, 3)];
    // Copy start date
    const current = new Date(this.fromTime);
    const end = new Date(this.toTime);
    // Shift to next of required days
    current.setDate(current.getDate() + (dayNumber - current.getDay() + 7) % 7);
    // While less than end date, add dates to result array
    while (current < end) {
      result.push(new Date(+current));
      current.setDate(current.getDate() + 7);
    }
    return result;
  }

}
export interface IFChartExtendDatasets extends ChartDataSets {
  columnName?: string;
}


