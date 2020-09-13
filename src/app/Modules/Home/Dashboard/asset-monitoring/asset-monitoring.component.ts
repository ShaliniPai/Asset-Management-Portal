import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AssetMonitoringService } from 'src/app/Core/Service/asset-monitoring.service';
import { ClassAMWidget } from 'src/app/Core/Class/class-widget-AssetMoni';
import * as moment from 'moment';
import { RbSpinnerService } from 'src/app/Core/Service/rb-spinner.service';
import { interval } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { SnackbarNotificationService } from 'src/app/Core/MatSnackBarCom/snackbar-notification.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material';
@Component({
  selector: 'app-asset-monitoring',
  templateUrl: './asset-monitoring.component.html',
  styleUrls: ['./asset-monitoring.component.scss']
})
export class AssetMonitoringComponent implements OnInit {

  // @ViewChild('slde', { static: false })
  @ViewChild('MPaginator', { static: false }) paginator: MatPaginator;
  selectedWidget: ClassAMWidget;
  bMachines: ClassAMWidget[];
  oCurrentShift: number;
  olastUpdatedOn: string;
  isSlidenavActive = 0;
  windowList: { value: string, text: string, slideState?: boolean };
  oLastReportUpdatedOn = new Date();
  noRowSpan = 1;
  breakpoint = 2;
  slideState = 3;
  favDevices: any[];

  favmetricWindow: { value: number, text: string };
  fromTime: number;
  toTime: number;
  rowSpanDevices: any[];
  isAutoRealodRTM = false;
  isSpinerLoading: boolean;
  /// Pagination Config
  paginationConfig = { pageSize: this.onPageSize(), itemsPerPase: [5, 10, 15, 20], pageIndex: 0, length: 0 };
  paginationSelIndexes: any[];
  paginationLen = 0;
  constructor(
    private router: Router,
    private self$: AssetMonitoringService,
    private spiner: RbSpinnerService,
    private snackbar: SnackbarNotificationService,
    private pagiInit: MatPaginatorIntl
  ) { }

  /* istanbul ignore next  */
  ngOnInit() {
    /** Rename the Pagination Range label */
    this.pagiInit.getRangeLabel = (page: number, pageSize: number, length: number) => {
      const start = page * pageSize + 1;
      let end = (page + 1) * pageSize;
      end = end <= length ? end : length;
      return `${start} - ${end} of ${length} widgets`;
    };

    this.self$.onRXUWigetValue(null);
    this.onInitLoadRTM();
    /// 5Min interval 300000
    interval(300000).pipe(startWith()).subscribe(ob => {
      if ((!!localStorage.getItem('RTM_did'))) {
        this.isAutoRealodRTM = true;
        const devices = JSON.parse(localStorage.getItem('RTM_did'));
        if (devices.length) {
          this.fun_LoadData(devices, 'present');
        }
      }
    });

    /**
     * Matside State Changes Open/closed
     */
    this.self$.rxMatSidenavState.subscribe((value: boolean) => {
      if (value !== null) {
        /// Pagination Dynamic page size based on sidenav toggle
        this.onPaginationSideNavAutoPageSize();
      }
    });

    /**
     * Capture the Window time  & sidenav state from rxjs observable
     */
    this.self$.rxWindowValue.subscribe((res: any) => {
      if (res) {
        this.windowList = res;
      }
      if (this.rowSpanDevices && this.rowSpanDevices.length > 0) {
        this.fun_LoadData(this.rowSpanDevices, 'past');
      }

      // console.log('window time ....' + JSON.stringify(this.windowList));
      //  this.breakpoint = res.slideState ? 2 : 3;
      // console.log(res);
      if (this.windowList && this.windowList.slideState === null) {
        if (!!localStorage.getItem('AssetMonSidenavState')) {
          this.breakpoint = 2;
        } else {
          this.breakpoint = 3;
        }
      } else {
        if (this.windowList && this.windowList.slideState) {
          this.breakpoint = 2;
        } else {
          this.breakpoint = 3;
        }
      }
      if (this.slideState !== this.breakpoint && this.bMachines) {
        this.bMachines.map(ele => ele.rowSpan = 1);
        this.rowSpanDevices = [];
        this.slideState = this.breakpoint;
      }

    });
    setTimeout(() => {
      //  this.spiner.onRBSpinner$(true);
      const defaultSidenavState = localStorage.getItem('AssetMonSidenavState');
      if (defaultSidenavState) {
        this.breakpoint = 2;
      }
      // this.onSelectWidget({ did: '' });
    });

    /** Get Selected Value using rx   */
    this.self$.rxWigetVale.subscribe(data => {
      this.selectedWidget = data;
    });

    /**
     * Load the widgetdata based on asset selection
     */
    this.self$.rxDevices.subscribe(res => {
      if (!!localStorage.getItem('AssetMonSidenavState')) {
        const data = JSON.parse(localStorage.getItem('AssetMonSidenavState'));
        if (data.type === 'asset') {
          if (res && res.length > 0) {
            if ((!!localStorage.getItem('RTM_did'))) {
              const devices = JSON.parse(localStorage.getItem('RTM_did'));
              this.fun_LoadData(devices, 'present');
              // this.windowList = JSON.parse(localStorage.getItem('RTM_windowMetric'));
            }
          } else {
            this.bMachines = [];
            localStorage.removeItem('LastRTMTriggerDevices');
          }
        }
      }

    });
  }

  /**
   * ///SRS ID : FD_IMPL_PCE_3_10.1
   * @param reportType There are two type of report present & past (metric Window selection)
   * @param devicesIds Devices Id's
   */
  fun_LoadData(devicesIds: string[], reportType: string) {
    this.onSpiner(true);
    if (this.windowList && this.windowList.value && devicesIds.length) {
      // this.onSpiner(true);
      const time = this.self$.onSetTime(reportType, this.windowList.value);
      this.favDevices = devicesIds;

      /// Apply pagination    /** Default appy the pagination */
      let devicesAfterPagi = devicesIds;
      if (reportType === 'present') {
        this.paginationConfig.length = devicesIds.length;
        if (this.paginationConfig.length !== 0 && this.paginationConfig.length > this.onPageSize()) {
          devicesAfterPagi = this.onAppyPagination(devicesIds);
        }
      }

      // let devicesAfterPagi = [];
      // if (this.paginationSelIndexes && this.paginationSelIndexes.length) {
      //   this.paginationSelIndexes.forEach(i => {
      //     if (devicesIds[i]) {
      //       devicesAfterPagi.push(devicesIds[i]);
      //     }
      //   });
      // } else {
      //   devicesAfterPagi = devicesIds;
      // }

      // const devIds = ['99999045', '99999031'];
      /* istanbul ignore next  */
      this.self$.getAPIMetric('rtm', time.fst, time.ts, devicesAfterPagi, 'total').subscribe(
        (data: any[]) => {
          /// Part of pagination , Sort the result based on selected devices came from treeview
          const res = [];
          devicesAfterPagi.forEach((ele: any) => {
            data.forEach(row => {
              if (ele === row.did) {
                res.push(row);
              }
            });
          });
          let temp = res.map(ele => new ClassAMWidget(ele));
          if (this.selectedWidget) {
            temp = temp.filter(ele => ele.assetId === this.selectedWidget.assetId);
          }
          if (reportType === 'past') {
            temp.forEach(ele => {
              this.bMachines.forEach(devId => {
                if (devId.did === ele.did) {
                  devId.metricWindow = {
                    floors: ele.floors,
                    trips: ele.trips,
                    util: ele.util,
                    downtime: ele.downtime,
                    energy: ele.energy,
                    floorsDay: ele.floorsDay,
                    tripsDay: ele.tripsDay,
                    peakHour: ele.peakHour,
                    peakDay: ele.peakDay,
                    energyDay: ele.energyDay
                  };
                }
              });
            });
          } else {
            this.bMachines = temp;
          }
          // console.log('Selecte Widget 5min : ' + JSON.stringify(this.selectedWidget));
          /// ** Auto Refresh the drill down page 'Current day data' as well. Without refreshing the past data
          if (this.selectedWidget && this.selectedWidget.assetId) {
            const widgetdata = this.bMachines.find(ele => ele.did === this.selectedWidget.did);
            widgetdata.metricWindow = this.selectedWidget.metricWindow;
            this.self$.onRXUWigetValue(widgetdata);
          }

          this.onSpiner(false);
          if (this.isAutoRealodRTM === true) {
            this.isAutoRealodRTM = false;
          }
          this.oLastReportUpdatedOn = new Date();
          localStorage.setItem('LastRTMTriggerDevices', JSON.stringify(devicesIds));

        }, error => {
          console.log(error);
          this.onSpiner(false);
          if (this.isAutoRealodRTM === true) {
            this.isAutoRealodRTM = false;
          }
        });

    } else {
      this.onSpiner(false);
    }
  }

  // onResize(event) {
  //   const width = event.target.innerWidth;
  //   if (width >= 1720) {
  //     this.breakpoint = 3;
  //   } else if (width < 1720 && width >= 1290) {
  //     this.breakpoint = 2;
  //   } else if (width < 1290 && width >= 860) {
  //     this.breakpoint = 2;
  //   } else { this.breakpoint = 1; }
  // }


/**
 * /// SRS ID: FD_IMPL_PCE_3_10.4
 * @param row Selecte wiget asset information
 */
  onClick_ShowDetails(row) {
    if (row.status.toLowerCase() === 'training' || row.status.toLowerCase() === 'error' || row.status.toLowerCase() === 'selected') {
    } else {
      //  this.rxjs.Update_rbs$_Machines({ data: [row], shift: this.oCurrentShift, lastUpdatedOn: this._LastUpdatedOn });
      this.router.navigate(['/landinghome/realtimemonitor/details']);
    }
  }

  onClass(firstName, lastName: string) {
    return firstName + lastName.toLowerCase();
  }


  /** Round the % value * Availability, performance, Quality, oee */
  onPerCentRoundTO100(value): string {
    if (value) {
      const val = Math.round(value < 0 ? 0 : (value > 100 ? 100 : value)) + '%';
      return val;
    }
    return '0%';
  }

  /**
   * ///SRS ID : FD_IMPL_PCE_3_10.1
   * @param assetId : Asset Object ID : 
   * Logic : To enable entire window time,
   * Step :1 Find the nearest values that can devide the no of widget in a column (no)
   * Step : 2 Untile find the nearest value increse the count
   */
  onRowSpanWidget(assetId, isRowSpanOne) {
    const index = this.bMachines.findIndex(ele => ele.assetId === assetId);
    if (index !== -1) {
      let isLoop = true;
      let j = index + 1;
      let nearestVal;
      const colCount = this.breakpoint;
      while (isLoop) {
        if (j % colCount === 0) {
          nearestVal = j;
          isLoop = false;
        } else {
          j++;
        }
      }
      let state = 0;
      if (this.bMachines[index].rowSpan === 2) {
        state = 1;
      }
      for (let i = nearestVal - 1; i + 1 !== nearestVal - this.breakpoint; i--) {
        if (this.bMachines[i]) {
          if (state !== 1) {
            if (this.bMachines[i].rowSpan === 1) {
              this.bMachines[i].rowSpan = 2;
            } else {
              this.bMachines[i].rowSpan = 1;
            }
          } else {
            this.bMachines[i].rowSpan = 1;
          }
        }
      }

      // RowSpan
      if (isRowSpanOne === 1) {
        const devicesId = [];
        this.bMachines.forEach(ele => {
          if (ele.rowSpan === 2) {
            devicesId.push(ele.did);
          }
        });
        // this.onSpiner(true);
        this.rowSpanDevices = devicesId;
        this.fun_LoadData(devicesId, 'past');
      } else {
        this.rowSpanDevices = [];
      }
    }
  }

  /**
   *
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
   *
   * @param row selected widget data
   * Check
   */
  /* istanbul ignore next  */
  onSelectWidget(row: ClassAMWidget) {
    const assetStatus = row.status.toLowerCase();
    if (assetStatus !== 'training' && assetStatus !== 'error') {
      this.onSpiner(true);
      const time = this.self$.onSetTime('past', this.windowList.value);
      this.self$.getAPIMetric('rtm', time.fst, time.ts, [row.did], 'total').subscribe(
        (data: any[]) => {
          const temp = data.map(ele => new ClassAMWidget(ele));
          temp.forEach(ele => {
            if (row.did === ele.did) {
              row.metricWindow = {
                floors: ele.floors,
                trips: ele.trips,
                util: ele.util,
                downtime: ele.downtime,
                energy: ele.energy,
                floorsDay: ele.floorsDay,
                tripsDay: ele.tripsDay,
                peakHour: ele.peakHour,
                peakDay: ele.peakDay,
                energyDay: ele.energyDay
              };
            }
          });
          this.onSpiner(false);
          this.router.navigate(['home/monitoring/details']);
          this.self$.onRXUWigetValue(row);
        }, error => {
          console.log(error);
          this.onSpiner(false);
        });
    } else {
      this.snackbar.onOpenSnack('error', 'Asset is in ' + assetStatus + ' mode');
    }
  }


  /// Auto Redirect
  /*
onSelectWidget(row: any) {
row = {
  'assetId': 'DRR-SKYWALKS-001', 'assetName': 'DRR-SKYWALKS-001', 'status': 'active',type:'elevator',
  'floors': 0, 'trips': 0, 'downtime': 0, 'energy': 0, 'rowSpan': 2, 'util': 100, 'timezone': '+05:30', 'did': '99999031',
  'floorsDay': 0, 'peakHour': '', 'peakDay': '', 'tripsDay': 0, 'energyDay': 0, 'metricWindow': {
    'floors': 7089, 'trips': 7089, 'util': 5,
    'downtime': 2591, 'energy': 46.823, 'floorsDay': 244, 'tripsDay': 244, 'peakHour': '12-1pm', 'peakDay': 'Mon', "energyDay": 2
  }
};
this.router.navigate(['home/monitoring/details']);
this.self$.onRXUWigetValue(row);
this.onSpiner(false);
 }
*/

  /**
   * When onpage load if window bar is open then RTM will 
   * not be open due to asset selection will not be happen (When open Asset sidevan than only asset will load into tree/API call happens)
   */
  onInitLoadRTM() {
    if (!!localStorage.getItem('AssetMonSidenavState')) {
      const data = JSON.parse(localStorage.getItem('AssetMonSidenavState'));
      if (data.type !== 'asset') {
        this.onSpiner(true);
        if (!!localStorage.getItem('RTM_windowMetric') && (!!localStorage.getItem('RTM_did'))) {
          const devices = JSON.parse(localStorage.getItem('RTM_did'));
          this.windowList = JSON.parse(localStorage.getItem('RTM_windowMetric'));
          this.fun_LoadData(devices, 'present');
        } else {
          this.loadFavMachines();
        }
      }
    } else {
      this.onSpiner(true);
      if (!!localStorage.getItem('RTM_windowMetric') && (!!localStorage.getItem('RTM_did'))) {
        const devices = JSON.parse(localStorage.getItem('RTM_did'));
        this.windowList = JSON.parse(localStorage.getItem('RTM_windowMetric'));
        this.fun_LoadData(devices, 'present');
      } else {
        this.loadFavMachines();
      }
    }
  }

  onSpiner(status: boolean) {
    if (this.isAutoRealodRTM === false) {
      setTimeout(() => {
        this.spiner.onRBSpinner$(status);
      }, 0);
    }
    this.isSpinerLoading = status;
  }

  loadFavMachines() {
    this.onSpiner(true);
    this.self$.getFavMachines().subscribe((favRes: { metricWindow: { value: string, text: string }, devices: string[] }) => {
      // if (favRes && favRes.devices && favRes.devices.length > 0) {
      if (favRes && favRes.devices) {
        localStorage.setItem('RTM_did', JSON.stringify(favRes.devices));
        if (favRes.metricWindow) {
          this.windowList = { value: favRes.metricWindow.value, text: favRes.metricWindow.text, slideState: true };
          localStorage.setItem('RTM_windowMetric', JSON.stringify(favRes.metricWindow));
        } /* istanbul ignore next  */else {
          /// Set Default value if there is no fav machines
          this.windowList = { value: 'L30D', text: 'Last 30 days', slideState: false };
          localStorage.setItem('RTM_windowMetric', JSON.stringify({ value: 'L30D', text: 'Last 30 days' }));
        }
        this.fun_LoadData(favRes.devices, 'present');
      } /* istanbul ignore next  */else {
        this.windowList = { value: 'L30D', text: 'Last 30 days', slideState: false };
        localStorage.setItem('RTM_windowMetric', JSON.stringify(this.windowList));
        this.self$.onRxUpdateWindowItem(this.windowList);
        this.onSpiner(false);
      }
      // this.onSpiner(false);
    }, error => {
      console.log(error);
      this.onSpiner(false);
    });
  }

  /**
   * @param ev Event of pagination change.
   * it's listener which call auto-on page change
   */
  onPageChange(ev: any) {
    this.onAssignPaginationIndex(ev);
    localStorage.setItem('LS_userPagination', JSON.stringify(ev));
    // console.log(arrIndex);
    if ((!!localStorage.getItem('RTM_did'))) {
      const devices = JSON.parse(localStorage.getItem('RTM_did'));
      if (devices.length) {
        this.fun_LoadData(devices, 'present');
        this.paginationConfig.length = devices.length;
      }
    }

  }

  /**
   * Assign the devices indexs based on pagination information
   */
  onAssignPaginationIndex(ev: any) {
    // console.log('Paginantion Event : ' + JSON.stringify(ev));
    const pageSize = ev.pageSize;
    const pageNumber = ev.pageIndex;
    this.paginationConfig.pageIndex = pageNumber;
    const len = ev.length;
    const startNo = pageSize * pageNumber;
    const arrIndex = [startNo];
    for (let i = 1; i < pageSize; i++) {
      if ((startNo + i) <= len) {
        arrIndex.push(startNo + i);
      }
    }
    this.paginationSelIndexes = arrIndex;
  }

  /**
   * Before all the RTM API check the pagination call pass the devicesid's accrodingly
   */
  onAppyPagination(devices: any[]) {
    let listDevices = [];
    if ((!!localStorage.getItem('LS_userPagination'))) {
      const devlen = JSON.parse(localStorage.getItem('RTM_did'));
      this.paginationConfig.length = devices.length;
      const pageConfig = JSON.parse(localStorage.getItem('LS_userPagination'));
      pageConfig.length = devices.length;
      this.onAssignPaginationIndex(pageConfig);
    } else {
      this.paginationConfig.length = devices.length;
      this.onAssignPaginationIndex({
        previousPageIndex: 0, pageIndex: 0,
        pageSize: this.onPageSize(),
        length: this.paginationConfig.length
      });
    }
    if (this.paginationSelIndexes && this.paginationSelIndexes.length) {
      this.paginationSelIndexes.forEach(i => {
        if (devices[i]) {
          listDevices.push(devices[i]);
        }
      });
    } else {
      listDevices = devices;
    }
    return listDevices;
  }

  onPageSize() {
    /// If sidenav is opened
    if (!!!localStorage.getItem('AssetMonSidenavState')) {
      return 9;
    }
    return 6;
  }



  /**
   * Pagination Dynamic Page size
   * Assing the pageSize based on Right SideBar state (Open or close ex: if it open then max 6 else 9)
   */
  onPaginationSideNavAutoPageSize() {
    if ((!!localStorage.getItem('RTM_did'))) {
      const devices = JSON.parse(localStorage.getItem('RTM_did'));
      /// Here 6 is the min number that are required to show show pagination.
      if (devices.length && devices.length > 6) {
        // if (devices.length && devices.length > this.onPageSize()) {
        this.paginationConfig.length = devices.length;
        if ((!!localStorage.getItem('LS_userPagination'))) {
          const pageConfig = JSON.parse(localStorage.getItem('LS_userPagination'));
          pageConfig['pageSize'] = this.onPageSize();
          // this.onAssignPaginationIndex(pageConfig);
          this.onPageChange(pageConfig);
        } else {
          this.onPageChange({
            previousPageIndex: 0, pageIndex: 0,
            pageSize: this.onPageSize(),
            length: this.paginationConfig.length
          });

        }
      }
    }
  }

}
