import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { IFTreeConfigDataModel } from '../../treeView/interface.treehierarchy';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { AssetMonitoringService } from 'src/app/Core/Service/asset-monitoring.service';
import { environment } from '../../../../../environments/environment';
import { SnackbarNotificationService } from 'src/app/Core/MatSnackBarCom/snackbar-notification.service';
import { TreeHierarchyService } from '../../treeView/tree-hierarchy.service';
import { RbSpinnerService } from 'src/app/Core/Service/rb-spinner.service';

@Component({
  selector: 'app-suite-asset-filter',
  templateUrl: './suite-asset-filter.component.html',
  styleUrls: ['./suite-asset-filter.component.scss']
})
export class SuiteAssetFilterComponent implements OnInit, OnDestroy, AfterViewInit {
  envURL = environment.metrics;



  @ViewChild('drawer', { static: false }) public sidenav: MatSidenav;
  /**
   * Here
   * isNotColumn will help to pass the static code that you passed default common for all the places
   * isNotColumn, that means it print as it is for every node inside tree
   */
  treeViewConfig: IFTreeConfigDataModel = {
    url: `${this.envURL}assets/getAssets`,
    dataModel: [
      { valCol: 'tenantId', textCol: 'tenantName', isNotColumns: false },
      { valCol: 'zid', textCol: 'zname', isNotColumns: false },
      { valCol: 'locId', textCol: 'locName', isNotColumns: false },
      { valCol: 'bid', textCol: 'bname', isNotColumns: false },
      { valCol: 'did', textCol: 'assetName', isNotColumns: false }
    ]
  };
  /// SRS ID: FD_IMPL_PCE_3_10.3
  listMetricWindow: any[] = [
    { value: 'L7D', text: 'Last 7 days' },
    { value: 'L30D', text: 'Last 30 days' },
    { value: 'L3M', text: 'Last 3 months' },
    { value: 'L1Y', text: 'Last 1 year' },
    { value: 'lifetime', text: 'Lifetime' },
  ];
  selWindowItem;
  isOpenedSideAsset = false;
  isOpenedSideWindow = false;
  treeType: string;
  favDevices: any[] = [];
  selectedDevices: any[];
  assetInfo: any[];
  private sub;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router$: ActivatedRoute,
    private $self: AssetMonitoringService,
    private snackbar: SnackbarNotificationService, private treeHierarchy: TreeHierarchyService,
    private spiner: RbSpinnerService) { }

    /* istanbul ignore next */
  ngOnInit() {

    /** TO Keep User seetion active assigning localstorage value to default windowitem */
    if (!!localStorage.getItem('RTM_windowMetric')) {
      this.selWindowItem = JSON.parse(localStorage.getItem('RTM_windowMetric')).value;
    }
    /**
     * Router Config
     */
    this.sub = this.router$.firstChild.params.subscribe(param => {
      // const paramName = 'treeType';   ;
      this.treeType = param.treeType;
    });
    /** Default window time selected item */
    // this.onChangeWindowTime(this.selWindowItem);

    /**
     * Subscribe the Treeview AssetInfo
     */
    this.treeHierarchy.rxAfterTreeInit.subscribe((res: any) => {
      this.assetInfo = res || [];
    });
    this.onLoadFavMachines();

  }

  ngAfterViewInit() {
    setTimeout(() => {
      const defaultSidenavState = localStorage.getItem('AssetMonSidenavState');
      if (defaultSidenavState) {
        const conlist = JSON.parse(defaultSidenavState);
        this.onToggleSideNav(conlist.type, conlist.isOpened);
      }
    });

  }




  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  /**
   * 
   * @param tabName : Which represent the sidenav type of display either Assets/windowTime
   */
  onToggleSideNav(tabName: string, bool: boolean) {
    this.sidenav.close();
    if (tabName === 'asset') {
      this.isOpenedSideWindow = false;
      this.isOpenedSideAsset = bool;
      // setTimeout(() => {
      //   this.sidenav.open();
      // }, 600);
    } else {
      this.isOpenedSideAsset = false;
      this.isOpenedSideWindow = bool;
      // setTimeout(() => {
      //   this.sidenav.open();
      // }, 600);
    }

    if (!this.isOpenedSideWindow && !this.isOpenedSideAsset) {
      this.sidenav.close();
      localStorage.removeItem('AssetMonSidenavState');
    } else {
      setTimeout(() => {
        this.sidenav.open();
      }, 300);
      if (bool) {
        const state = { type: tabName, isOpened: bool };
        localStorage.setItem('AssetMonSidenavState', JSON.stringify(state));
      }
    }
    /// Below two lines of code curretly use for pagination - Auto page ize
    this.$self.RXUpdateMatSidenavState(bool);
    // if ((!this.isOpenedSideWindow && !this.isOpenedSideAsset)) {

    // } else if ((this.isOpenedSideWindow || !this.isOpenedSideAsset) || (!this.isOpenedSideWindow || this.isOpenedSideAsset) && bool) {
    //   this.$self.RXUpdateMatSidenavState(bool);
    // }
    this.onChangeWindowTime(this.selWindowItem);
  }


  /**
   *  /// SRS ID: FD_IMPL_PCE_3_10.2
   * Checkbox selection changes
   *//* istanbul ignore next */
  OnTreeSelectedItem(item: any[]) {
    this.selectedDevices = item;
    if (item) {
      let data = this.onReturnDevices(item);
      /// Check the devices which already api requested
      if (!!localStorage.getItem('LastRTMTriggerDevices')) {
        const oldDevices = JSON.parse(localStorage.getItem('LastRTMTriggerDevices'));
        const isanyNewDevice = this.onDeviceExists(item, oldDevices);
        if (isanyNewDevice === true) {
          /* This pease of code use for pagination, show the latest checked values at fist page as first widget*/
          data = this.onSortLastestItem(oldDevices, data);
          this.favDevices = data;
          localStorage.setItem('RTM_did', JSON.stringify(data));
          console.log('devices' + JSON.stringify(data));
          this.$self.onRxTreeDevices(data);
        }
      } else {
        this.favDevices = data;
        localStorage.setItem('RTM_did', JSON.stringify(data));
        console.log('devices' + JSON.stringify(data));
        this.$self.onRxTreeDevices(data);
      }
    }
  }

  /**
   * /// SRS ID: FD_IMPL_PCE_3_10.3
   * Radio selection changes
   *//* istanbul ignore next */
  onChangeWindowTime(value: any) {
    if (this.sidenav && value) {
      const list = this.listMetricWindow.find(ele => ele.value === value);
      localStorage.setItem('RTM_windowMetric', JSON.stringify(list));
      list['slideState'] = this.sidenav && this.sidenav.opened ? this.sidenav.opened : null;
      this.$self.onRxUpdateWindowItem(list);
    }
  }

  /**
   * 
   * @param items List of array which should include did number and finaly it returns the did from list of array
   */
  onReturnDevices(items: any[]) {
    // console.log(items);
    let did = [];
    let col;
    let value;
    items.forEach((row, index) => {
      col = row.type;
      value = row.value;
      if (this.assetInfo && this.assetInfo.length > 0) {
        this.assetInfo.map(ele => {
          if (ele[col] === value) {
            did.push(ele.did);
          }
        });

      }
    });
    return did;

  }

  
  onDeviceExists(newItem: any[], olditem: any[]): boolean {
    if (olditem.length === newItem.length) {
      olditem.forEach(eleOld => {
        const isnotExists = newItem.findIndex(newEle => newEle === eleOld);
        if (isnotExists === -1) {
          return true;
        }
      });
      return false;
    }
    return true;
  }

  onArrowAssets(bool) {
    setTimeout(() => {
      return bool ? '0px' : '-31px';
    }, 350);
    return '-31px';

  }


  /**
   * /// SRS ID: FD_IMPL_PCE_3_10.2
   * Save as Default
   */

    /* istanbul ignore next */
  onSaveAsDefault() {
    const favpayload = {}; // { devices: string[], metricWindow?: { value: number, text: string } };
    if (this.isOpenedSideAsset === true) {
      if (this.selectedDevices && this.selectedDevices.length > 0) {
        favpayload['devices'] = this.selectedDevices.map(ele => ele.did);
      } else {
        this.snackbar.onOpenSnack('error', 'Minimum one Asset is required for save');
      }
    } else {
      favpayload['metricWindow'] = this.listMetricWindow.find(ele => ele.value === this.selWindowItem);
    }
    if (favpayload && (favpayload['devices'] || favpayload['metricWindow'])) {
      this.onSpiner(true);
      this.$self.putFavmachiens(favpayload).subscribe((res: any) => {
        this.onSpiner(false);
        if (res.success) {
          this.snackbar.onOpenSnack('success', res.message);
        }
      }, error => {
        this.onSpiner(false);
        if (this.isOpenedSideAsset) {
          this.snackbar.onOpenSnack('error', 'Failed to save the selected machines');
        } else {
          this.snackbar.onOpenSnack('error', 'Failed to save the Metric Window');
        }
        console.log(error);
      });
    } else {
      if (this.isOpenedSideAsset) {
        this.snackbar.onOpenSnack('error', 'Select minimum one asset to save');
      } else {
        this.snackbar.onOpenSnack('error', 'Select the metric Window to save');
      }

    }
  }


  onLoadFavMachines() {
    if (!!localStorage.getItem('RTM_windowMetric') && (!!localStorage.getItem('RTM_did'))) {
      this.favDevices = JSON.parse(localStorage.getItem('RTM_did'));
      this.selWindowItem = JSON.parse(localStorage.getItem('RTM_windowMetric')).value;
    } else {
      this.onSpiner(true);
      this.$self.getFavMachines().subscribe((favRes: { metricWindow: { value: string, text: string }, devices: string[] }) => {
        if (favRes && favRes.devices && favRes.devices.length > 0) {
          this.favDevices = favRes.devices;
          if (favRes.metricWindow && favRes.metricWindow.value) {
            this.selWindowItem = favRes.metricWindow.value;
          } else {
            this.selWindowItem = 'L30D';
          }
          this.onChangeWindowTime(this.selWindowItem);
        } else {
          this.selWindowItem = 'L30D';
        }
        //   this.onSpiner(false);
      }, error => { console.log(error); this.onSpiner(false); });
    }
  }

  onSpiner(status: boolean) {
    setTimeout(() => {
      this.spiner.onRBSpinner$(status);
    }, 0);
  }

  /**
   * 
   * @param oldDevices Old devices which are there in localstoreage
   * @param newDevices Those are selected in current selection
   *//* istanbul ignore next */
  onSortLastestItem(oldDevices, newDevices) {
    const result = [];
    oldDevices.forEach(ele => {
      const j = newDevices.findIndex(i => i === ele);
      if (j !== -1) {
        result.push(ele);
      }
    });
    const len = newDevices.length - oldDevices.length;
    if (len > 0) {
      newDevices.forEach(ele => {
        const j = oldDevices.findIndex(i => i === ele);
        if (j === -1) {
          result.push(ele);
        }
      });
    }
    if (result.length && result.length > oldDevices.length) {
      /** Sort based on old value */
      result.unshift(result[result.length - 1]);
      result.pop();
    }
    return result;
  }

}
