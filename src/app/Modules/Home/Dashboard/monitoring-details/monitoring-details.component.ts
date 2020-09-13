import { Component, OnInit } from '@angular/core';
import { AssetMonitoringService } from 'src/app/Core/Service/asset-monitoring.service';
import { ClassAMWidget } from 'src/app/Core/Class/class-widget-AssetMoni';
import { Router } from '@angular/router';

@Component({
  selector: 'app-monitoring-details',
  templateUrl: './monitoring-details.component.html',
  styleUrls: ['./monitoring-details.component.scss']
})
export class MonitoringDetailsComponent implements OnInit {
  row: ClassAMWidget;
  breakpoint = 3;
  rowSpan: boolean;
  oLastReportUpdatedOn = new Date();
  windowList: { value: string, text: string, slideState: boolean };
  constructor(private self$: AssetMonitoringService, private route: Router) { }

  ngOnInit() {
    /**
     * /// SRS ID: FD_IMPL_PCE_3_10.4
     * Get Selected Value using rx observer
     */
    this.self$.rxWigetVale.subscribe(data => {
      if (data) {
        this.row = data;
      } else {
        this.route.navigate(['home/suite/assetMonitoring/', 'checkbox']);
      }

    });

    /** * Capture the Window time  & sidenav state from rxjs observable */
    this.self$.rxWindowValue.subscribe(res => {
      this.windowList = res;
    });

  }

  /**
   * @param v : Values number/String
   * If the font-size is more than 4 words, decrese the font-size respectively
   */
  onFontSize(v: any) {
    if (v) {
      const t = v.toString().length;
      if (t > 4) {
        return '1.1vw';
      }
      return '21px';
    }
    return '21px';
  }
  /**
   * /// SRS ID: FD_IMPL_PCE_3_10.4
   * @param bool row expanded or not
   */
  onSpanRow(bool: boolean) {
    this.rowSpan = bool ? false : true;
    this.breakpoint = this.rowSpan === true ? 2 : 3;

  }

  onBack() {
    this.route.navigate(['home/suite/assetMonitoring/', 'checkbox']);
    this.self$.onRXUWigetValue(null);
  }

}
