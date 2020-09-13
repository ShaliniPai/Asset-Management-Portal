import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AssetManagerService } from 'src/app/Core/Service/asset-manager.service';
import { MatSnackBar, MatTable } from '@angular/material';
import { CorpSettingUserService } from 'src/app/Core/Service/corp-setting-user.service';
import { RbSpinnerService } from 'src/app/Core/Service/rb-spinner.service';
import * as data from 'src/assets/json/isdCodes.json';
import { ViewAssetService } from 'src/app/Core/Service/view-asset.service';
import { AuthorizationService } from 'src/app/Core/Service/authorization.service';
import { SitesService } from 'src/app/Core/Service/sites.service';


@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {
  firstName: string;
  lastName: string;
  unique_key: string;
  email: string;
  phone: string;
  userRole: string;
  assets: any[];
  SearchTerm: any;
  lname: string;
  DeleteId: any;
  editIndex = 0;
  editRow = false;
  delrow = false;
  ConfirmDeletion: any;
  OnChangeFilter: any;
  setRowStyles: any;
  ConfirmDelete: any;
  setRowStylesForDel: any;
  selectedRowIndex: any;
  Cancel: any;
  CreateUserNavigation: any;
  OnAddUserListViewNextBtn: any;
  _ModuleType;
  bUserInfo: any;
  IsSuccess: any;
  Message: any;
  IsError: any;
  IsDel: any;
  Changes: any;
  OnEditButtonClick: any;
  OnCancelDelete: any;
  OnDeleteUser: any;
  OnClikcGoBack: any;
  onUpdateUser: any;
  childmessage: any;
  IsDeleteButtonVisible: any;
  IsAllDisabled: any;
  DeleteUser: any;
  allZoneFilter: any[];
  allSiteFilter: any[];
  siteFilter: any[];
  zoneFilter: any[];
  itemsSiteFilter: any[];
  itemsZoneFilter: any[];
  backupSites: any[];
  assetTypesFilter: string[] = [];
  assetStatesFilter: string[] = [];
  allAssetTypesFilter: string[] = ['Elevator', 'Escalator'];
  allAssetStatesFilter: string[];
  assetTypeList: string[] = ['Elevator', 'Escalator'];
  assetStateList: string[];
  itemsAssetTypeFilter: string[] = ['Elevator', 'Escalator'];
  itemsAssetStateFilter: string[];
  backupAssetTypes: any[];
  public selectSortBy: any;
  displayedColumns: string[] = ['sno', 'assetName', 'type', 'assetState', 'sensorHwId', 'site', 'wingBlock', 'nextPm', 'view'];
  sortedAssets: any;
  siteList = [] ;

  public isdCodes: any = data;
  profileForm = new FormGroup({
    /********update user data***********/
    sensorHwId: new FormControl('')
    /********update user data***********/
  });
  assetsComponent: any[];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient, private assetManagerService: AssetManagerService,
    private ngSnackbar: MatSnackBar, private corpSettingUserService: CorpSettingUserService,
    private spinner: RbSpinnerService, public $auth: AuthorizationService,
    private viewAssetService: ViewAssetService, private sitesService: SitesService) { }

  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  ngOnInit() {
    this.getAssetData();
    this.onAuthPermission();
  }
  /**
   * Authorization : Give the HW Sensor ID add/modification permission only to Installer
   * For that check login user having role as 'Installer'
   */
  onAuthPermission() {
    const grantAccess = this.$auth.$grantAccess('I');
    if (grantAccess === true) {
      this.displayedColumns = ['sno', 'assetName', 'type', 'assetState', 'sensorHwId', 'site', 'wingBlock', 'nextPm', 'view'];
    } else {
      this.displayedColumns = ['sno', 'assetName', 'type', 'assetState', 'site', 'wingBlock', 'nextPm', 'view'];
    }
  }

  sortAsset(event: any) {
    // this.dataSource={};
    this.assets = [];
    console.log('calling sort' + event.target.value);

    if (event.target.value === 'assteType') {
      function compare(a, b) {
        const bandA = a.assetCategory.toUpperCase();
        const bandB = b.assetCategory.toUpperCase();

        let comparison = 0;
        if (bandA < bandB) {
          comparison = -1;
        } else if (bandA > bandB) {
          comparison = 1;
        }
        return comparison;
      }
      this.sortedAssets = this.sortedAssets.sort(compare);
      this.table.renderRows();
      this.assets = this.sortedAssets;
    }
    if (event.target.value === 'assetName') {
      function compare(a, b) {
        const bandA = a.assetName.toUpperCase();
        const bandB = b.assetName.toUpperCase();

        let comparison = 0;
        if (bandA < bandB) {
          comparison = -1;
        } else if (bandA > bandB) {
          comparison = 1;
        }
        return comparison;
      }
      this.sortedAssets = this.sortedAssets.sort(compare);
      this.table.renderRows();
      this.assets = this.sortedAssets;
    }
    if (event.target.value === 'assetState') {
      function compare(a, b) {
        const bandA = a.status.toUpperCase();
        const bandB = b.status.toUpperCase();

        let comparison = 0;
        if (bandA < bandB) {
          comparison = -1;
        } else if (bandA > bandB) {
          comparison = 1;
        }
        return comparison;
      }
      this.sortedAssets = this.sortedAssets.sort(compare);
      this.table.renderRows();
      this.assets = this.sortedAssets;
    }
  }

  getAssetData() {
    this.onSpinner(true);
    this.assetManagerService.getAsset().subscribe((res: any) => {
      this.getSites();
      this.assets = res.data;
      this.sortedAssets = res.data;
      console.log(res.data);
      for (let i = 0; i < this.assets.length; i++) {
        if (this.assets[i].enabled === true) {
          this.assets[i].status = 'active';
        }
        if(this.assets[i].maintDt === null) {
          this.assets[i].maintDt = null ;
        } else {
        this.assets[i].maintDt = new Date(this.assets[i].maintDt).toLocaleDateString();
        }
      }
      this.onSpinner(false);
    }, err => {
      this.onSpinner(false);
      console.log(err);
    });
  }

  onEdit(index, row) {
    this.editRow = true;
    this.editIndex = index;
    console.log('editRow=' + this.editRow);
    console.log('editIndex=' + this.editIndex);
  }

  onUndo(index, row) {
    this.editIndex = 0;
    this.editRow = false;
    this.getAssetData();
  }

  onUpdate(i, row) {
    this.onSpinner(true);

    let deviceData = {
      assetName: row.assetName,
      devId: this.profileForm.value.sensorHwId
    };
    this.assetManagerService.addSensorHwId(deviceData).subscribe((res: any) => {
      this.onSpinner(false);
      this.ngSnackbar.open(res.message, 'OK', { duration: 2000, panelClass: 'snackbar-success' });
      window.location.reload();
    }, err => {
      console.log(err);
      this.onSpinner(false);
      this.ngSnackbar.open('Sensor HW Id cannot be updated.', 'OK', { duration: 3200, panelClass: 'alert-info' });
    });
    console.log(this.profileForm.value.sensorHwId);
  }

  viewAsset(row) {
    console.log(row);
    this.viewAssetService.setAssetDetails(row);
    console.log(this.viewAssetService.currentAssetDetails);
    this.router.navigate(['/home/corp/user/viewAssetDetails']);
  }

  getSites() {
    this.sitesService.getSites().subscribe((res: any) => {
      this.siteList = res;
      for (let i = 0; i < this.assets.length; i++) {
        console.log(this.siteList.length);
        for (let j = 0; j < this.siteList.length; j++) {
          if (this.siteList[j]._id === this.assets[i].locId) {
            this.assets[i].locId = this.siteList[j].des;
          }
        }
      }
      this.onConfigFilter(this.assets);
      this.onSpinner(false);
    }, err => {
      console.log(err);
      this.onSpinner(false);
    });
  }

  onImageFitler(col: string): string {
    if (col === 'zone') {
      if (this.allZoneFilter && this.allZoneFilter.length) {
        return 'fillterICON_NoFill';
      }
      return 'filterICON';
    } else if (col === 'siteName') {
      if (this.allSiteFilter && this.allSiteFilter.length) {
        return 'fillterICON_NoFill';
      }
      return 'filterICON';
    } else if (col === 'assetType') {
      if (this.allAssetTypesFilter && this.allAssetTypesFilter.length) {
        return 'fillterICON_NoFill';
      }
      return 'filterICON';
    } else if (col === 'assetState') {
      if (this.allAssetStatesFilter && this.allAssetStatesFilter.length) {
        return 'fillterICON_NoFill';
      }
      return 'filterICON';
    }
    return 'fillterICON_NoFill';
  }

  /**
   * COnfig the fitler items
   * @param data Data that are going to bind to table
   */
  onConfigFilter(assetData: any[]) {
    this.backupAssetTypes = assetData;
    this.assetTypesFilter = assetData.map(ele => ele.assetCategory).filter((item, i, source) => source.indexOf(item) === i).sort();
    this.assetStatesFilter = assetData.map(ele => ele.status).filter((item, i, source) => source.indexOf(item) === i).sort();
    this.siteFilter = assetData.map(ele => ele.siteName).filter((item, i, source) => source.indexOf(item) === i).sort();
    this.zoneFilter = assetData.map(ele => ele.bname).filter((val, i, source) => source.indexOf(val) === i).sort();
    this.itemsAssetTypeFilter = this.assetTypesFilter;
    this.itemsAssetStateFilter = this.assetStatesFilter;
    this.itemsZoneFilter = this.zoneFilter;
    this.itemsSiteFilter = this.siteFilter;
    this.allSiteFilter = ['all'];
    this.allZoneFilter = ['all'];
    this.allAssetTypesFilter = ['all'];
    this.allAssetStatesFilter = ['all'];
  }

    /**
     * Select ALL checkbox (Zone & Sitename)
     * @param col column name when click on select all checkbox
     */
    onFilterSelectAll(col: string) {
    if (col === 'assetType') {
      if (this.allAssetTypesFilter && this.allAssetTypesFilter.length) {
        // tslint:disable-next-line:max-line-length
        this.itemsAssetTypeFilter = this.backupAssetTypes.map(ele => ele.assetCategory).filter((val, i, source) => source.indexOf(val) === i).sort();
      } else {
        this.itemsAssetTypeFilter = [];
      }
    } else if (col === 'zone') {
      if (this.allZoneFilter && this.allZoneFilter.length) {
        this.itemsZoneFilter = this.backupAssetTypes.map(ele => ele.bname).filter((val, i, source) => source.indexOf(val) === i).sort();
      } else {
        this.itemsZoneFilter = [];
      }
    } else if (col === 'siteName') {
      if (this.allSiteFilter && this.allSiteFilter.length) {
        // tslint:disable-next-line:max-line-length
        this.itemsSiteFilter = this.backupAssetTypes.map(ele => ele.siteName).filter((item, i, source) => source.indexOf(item) === i).sort();
      } else {
        this.itemsSiteFilter = [];
      }
    } else if (col === 'assetState') {
      if (this.allAssetStatesFilter && this.allAssetStatesFilter.length) {
        // tslint:disable-next-line:max-line-length
        this.itemsAssetStateFilter = this.backupAssetTypes.map(ele => ele.status).filter((val, i, source) => source.indexOf(val) === i).sort();
      } else {
        this.itemsAssetStateFilter = [];
      }
    }
    this.onFilterChange();
  }

  onFilterChange() {
    const assetTypeData = [];
    const zonedata = [];
    const sitedata = [];
    const assetStatedata = [];

    console.log(this.assets);

    this.itemsZoneFilter.forEach(ele => {
      this.backupAssetTypes.forEach((row) => {
        if (row.bname === ele) {
          zonedata.push(row);
        }
      });
    });
    console.log(zonedata);
    this.itemsSiteFilter.forEach(ele => {
      zonedata.forEach((row) => {
        if (row.siteName === ele) {
          sitedata.push(row);
        }
      });
    });
    console.log(sitedata);
    /// Level 1 : Check first any asset types are selected
    for ( const asset of this.itemsAssetTypeFilter ) {
      for ( const assetFilter of sitedata) {
        if ( asset === assetFilter.assetCategory ) {
          assetTypeData.push(assetFilter);
        }
      }
    }
    console.log(assetTypeData);
    this.itemsAssetStateFilter.forEach(ele => {
      assetTypeData.forEach((row) => {
        if (row.status === ele) {
          assetStatedata.push(row);
        }
      });
    });
    /// Check the All checkbox when all the items selected
    if (this.assetTypesFilter.length === this.itemsAssetTypeFilter.length) {
      this.allAssetTypesFilter = ['all'];
    } else {
      this.allAssetTypesFilter = [];
    }
    if (this.assetStatesFilter.length === this.itemsAssetStateFilter.length) {
      this.allAssetStatesFilter = ['all'];
    } else {
      this.allAssetStatesFilter = [];
    }
    /// Check the All checkbox when all the items selected
    if (this.siteFilter.length === this.itemsSiteFilter.length) {
      this.allSiteFilter = ['all'];
    } else {
      this.allSiteFilter = [];
    }
    if (this.zoneFilter.length === this.itemsZoneFilter.length) {
      this.allZoneFilter = ['all'];
    } else {
      this.allZoneFilter = [];
    }
    this.assets = [...assetStatedata];
  }

  onSpinner(bool: boolean) {
    setTimeout(() => {
      this.spinner.onRBSpinner$(bool);
    });
  }


}
