import { Component, OnInit } from '@angular/core';
import { AssetMonitoringService } from 'src/app/Core/Service/asset-monitoring.service';
import { IFutilChartRaw } from 'src/app/Core/Interface/utilChartRawData.interface';
import { IFchartRawData } from 'src/app/Core/Interface/chartRawData.interface';
import { Label } from 'ng2-charts';
import { ChartOptions, ChartDataSets } from 'chart.js';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-energy',
  templateUrl: './energy.component.html',
  styleUrls: ['./energy.component.scss']
})
export class EnergyComponent implements OnInit {

  constructor(private $self: AssetMonitoringService, private router: Router) { }
  tzName;
  rawData: IFutilChartRaw[];
  timeZone;
  barChartLabels: Label[];
  DatasetsConfig: IFChartExtendDatasets[];
  barChatDatasets: IFChartExtendDatasets[];
  barChartOptions: ChartOptions;
  reportType;
  assetName;
  ngOnInit() {
    /// Get Data from respective api's
    this.$self.rxchartRawData.subscribe((res: IFchartRawData) => {
      const url = this.router.url;
      console.log(url);
      /* istanbul ignore next */
      if (res && res.data && url.includes('energy')) {
        this.rawData = res.data.data;
        // this.reportType.
        this.timeZone = res.data.timeZone;
        this.reportType = res.reportInterval;
        this.barChartLabels = this.OnLabels(res.fst, res.ts, this.timeZone, res.reportInterval);
        // this.barChartLabels = ['A', 'B', 'C'];
        // this.
        console.log('Util Chart Label : ' + JSON.stringify(this.barChartLabels));
        this.onChartOptions();
        this.onAccumulateData();
      }
    });
  }

  OnLabels(fromtime: number, toTime: number, timeZone: string, reportInterval: any) {
    const labels = [];
    if (reportInterval === 'hour' || reportInterval === 'day' || reportInterval === 'week') {
      let dateFormat = 'YYYY-MM-DD HH:mm:ss';
      if (reportInterval === 'day') {
        dateFormat = 'YYYY-MM-DD';
      } else if (reportInterval === 'week') {
        dateFormat = 'YYYY-WW';
      }
      const timeDiff = moment(toTime).diff(fromtime, reportInterval);
      for (let i = 0; i <= timeDiff; i++) {
        const time = moment(fromtime).add(reportInterval, i).valueOf(); // .format(dateFormat);
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
    this.DatasetsConfig = [
      { label: 'Total Energy(kWh)', backgroundColor: '#78BE20', data: [], maxBarThickness: 40, columnName: 'value' }
    ];

    this.DatasetsConfig.forEach((ele: IFChartExtendDatasets) => {
      this.barChartLabels.forEach(label => {
        let dateFormat = 'YYYY-MM-DD HH:mm:ss';
        if (this.reportType === 'week') {
          dateFormat = 'YYYY-WW';
        }
        const fitlerLabel = moment(label).utcOffset(this.timeZone).format(dateFormat);
        const val = this.rawData.find(element => fitlerLabel === element.date);
        const colVal = val && val[ele.columnName] ? (val[ele.columnName]).toFixed(2) : 0;
        ele.data.push(colVal);
      });
    });
    this.barChatDatasets = [... this.DatasetsConfig];
  }

  onChartOptions() {
    this.barChartOptions = {
      maintainAspectRatio: false,
      tooltips: {
        callbacks: {
          label: (tooltipItem) => {
            return tooltipItem.value + ' kWh';
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
          display: true, ticks: { beginAtZero: true },
          gridLines: { display: true },
          scaleLabel: {
            display: true,
            labelString: 'Energy (kWh)',
            fontFamily: 'Roboto,sans-serif', fontSize: 14, fontColor: '#657c93'
          }
        }
        ],
        xAxes: [{
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
            drawBorder: false,
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
      // return moment(value).utcOffset(this.timeZone).format('YYYY / WW');
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

}

export interface IFChartExtendDatasets extends ChartDataSets {
  columnName?: string;
}
