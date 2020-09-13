import { Component, OnInit } from '@angular/core';
import { weekdays } from 'moment';
import { Validators, FormGroup, FormControl, NgForm, FormBuilder } from '@angular/forms';
import { AssetManagerService } from 'src/app/Core/Service/asset-manager.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RbSpinnerService } from 'src/app/Core/Service/rb-spinner.service';
import { MatSnackBar } from '@angular/material';
import { SitesService } from 'src/app/Core/Service/sites.service';
import * as data from 'src/assets/json/oemName.json';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { AddOEMService } from 'src/app/Core/Service/add-oem.service';


@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.scss']
})
export class AddAssetComponent implements OnInit {
  public isButtonVisible = true;
  public isOEMButtonVisible = true;
  public selectCriterion = 'Fixed Frequency';
  public selectAssetType = 'Elevator';
  public selectDays = 'Weekend';
  public isChecked = true;
  public entityName: any;
  asset: any;
  oemname: any;
  _ModuleType: any;
  days: any;
  model: any;
  isDisabled: any;
  // tslint:disable-next-line:max-line-length
  selectedSite: { tenant: any, wifiPassword: any, wifiSSID: any, zid: any, locId: any, loc: { latitude: any, longitude: any}, opHours: { weekdays: { time: { from: { hh: any; mm: any; meridiem: any; }; to: { hh: any; mm: any; meridiem: any; }; }; days: any[]; }; weekend: { time: { from: { hh: any; mm: any; meridiem: any; }; to: { hh: any; mm: any; meridiem: any; }; }; days: any[]; }; }; des: any; zone: string; siteName: string; };
  childmessage: any;
  newWingBlock: any; bottomFloor: any;
  // tslint:disable-next-line:max-line-length
  otherOemName: any; selectDaysMonths: any; selectMinsHours: any; BottomFloor: any; topFloor: any; wingBlock: any; assetDescription: any; oemModelName: any;
  // tslint:disable-next-line:max-line-length
  fromHours: string; fromMins: any; selectFromAmPm: string; toHours: string; toMins: any; selectToAmPm: string; trips: any; date: any; oemName: string; assetName: any; selected: boolean;
  fromHoursEnd: string; fromMinsEnd: any; selectFromAmPmEnd: string; toHoursEnd: string; toMinsEnd: any; selectToAmPmEnd: string;
  public monday: boolean;
  public tuesday: boolean;
  public thrusday: boolean;
  public wednesday: boolean;
  public friday: boolean;
  public saturday: string | boolean;
  public sunday: boolean;

  public operatingHours = new Array();
  public prevMainValue: any;
  public prevMainUnit: string;
  public blockList: string | any[];
  public siteList: string | any[];
  breakCode = 1;
  public oemNameList: any[] = [];
  tempBid: string;
  newBid: string;
  public assetList: any;
  public assetDetail: { assetCategory: string; locId: string; oemName: string; oemModelName: any; };
  public siteDetail: any;
  isOtherOemName = false;
  tempOemName: any;
  selectExistingAsset = '0';
  getBid: any;
  fromH: any;
  fromM: any;
  fromAmPm: any;
  toH: any;
  toM: any;
  toAmPm: any;
  fromHEnd: any;
  fromMEnd: any;
  fromAmPmEnd: any;
  toHEnd: any;
  toMEnd: any;
  toAmPmEnd: any;
  firstTime: number;
  weekdaysArray = new Array();
  weekendArray = new Array();
  bname: any;
  newBname: string;
  site: any;
  finalBid: any;
  recentSelectedSite: string;
  recentSelectedAsset: any;
  fg: FormGroup;
  assetGroup: FormGroup;
  checkSiteOppHrs: any;
  selectOEM: string;
  finalSiteName: string;
  finalBlockId: string;
  siteOperatingHours: boolean;
  finalLocId: any;
  finalZId: any;
  // recent
  constructor(private router: Router, private http: HttpClient, private assetManagerService: AssetManagerService,
              private spinner: RbSpinnerService, private ngSnackbar: MatSnackBar, private sitesService: SitesService,
              private fb: FormBuilder, private addOemService: AddOEMService) { }

  ngOnInit() {
    // this.getBlock();
    this.getOemNames();
    this.getSites();
    this.getAssetData();
    this.fg = this.fb.group({
      copyAssetDetails: ['0', Validators.required]
    });

    this.assetGroup = this.fb.group({
      assetName: ['', Validators.required],
      assetType: ['Elevator', Validators.required],
      bottomFloor: [],
      topFloor: [],
      siteName: ['0', Validators.required],
      wingBlock: ['0', Validators.required],
      newWingBlock: ['', Validators.required],
      assetDescription: [''],
      selectOEM: ['0'],
      otherOemName: [''],
      oemModelName: [''],
      checkSiteOppHrs: [true, Validators.required],
      selectDays: ['Weekdays', Validators.required],
      monday: [],
      tuesday: [],
      wednesday: [],
      thrusday: [],
      friday: [],
      saturday: [],
      sunday: [],
      weekendMonday: [],
      weekendTuesday: [],
      weekendWednesday: [],
      weekendThrusday: [],
      weekendFriday: [],
      weekendSaturday: [],
      weekendSunday: [],
      weekdaysFromHours: [],
      weekdaysFromMins: [],
      weekdaysToHours: [],
      weekdaysToMins: [],
      weekendFromHours: [],
      weekendFromMins: [],
      weekendToHours: [],
      weekendToMins: [],
      selectFromAmPm: ['AM'],
      selectToAmPm: ['AM'],
      weekendSelectFromAmPm: ['AM'],
      weekendSelectToAmPm: ['AM'],
      selectMinsHours: [],
      selectCriterion: ['0'],
      selectUnits: ['0'],
      unitValue: [],
      date: []
    });

    this.firstTime = 1;
  }

  validateForm() {

    if (!!!this.assetGroup.controls.assetName.value) {
      this.ngSnackbar.open('Please Enter Asset Name.', 'OK', { duration: 2200, panelClass: 'alert-info' });
      return;
    }
    if (!!!this.assetGroup.controls.bottomFloor.value && this.assetGroup.controls.bottomFloor.value !== 0) {
      this.ngSnackbar.open('Please Enter Bottom Floor value.', 'OK', { duration: 2200, panelClass: 'alert-info' });
      return;
    }
    if (!!!this.assetGroup.controls.topFloor.value && this.assetGroup.controls.topFloor.value !== 0) {
      this.ngSnackbar.open('Please Enter Top Floor value.', 'OK', { duration: 2200, panelClass: 'alert-info' });
      return;
    }
    if (this.assetGroup.controls.bottomFloor.value >= this.assetGroup.controls.topFloor.value) {
      this.ngSnackbar.open('Top floors should be greater than bottom floor.', 'OK', { duration: 2200, panelClass: 'alert-info' });
      return;
    }
    if (this.assetGroup.controls.siteName.value === '0' ) {
      this.ngSnackbar.open('Please Select Site Name.', 'OK', { duration: 2200, panelClass: 'alert-info' });
      return;
    }
    if (this.assetGroup.controls.wingBlock.value === '0' ) {
      this.ngSnackbar.open('Please Select Wing/Block Name.', 'OK', { duration: 2200, panelClass: 'alert-info' });
      return;
    }
    if (this.assetGroup.controls.selectCriterion.value !== '0') {
      // tslint:disable-next-line:max-line-length
      if (!!!this.assetGroup.controls.unitValue.value || (this.assetGroup.controls.selectUnits.value === '0' && this.assetGroup.controls.selectCriterion.value !== 'By Usage - No. of trips')) {
        this.ngSnackbar.open('Please Enter Preventive Maintenance Criteria.', 'OK', { duration: 2200, panelClass: 'alert-info' });
        return;
      }
      if (this.assetGroup.controls.unitValue.value <= 0 ) {
        // tslint:disable-next-line:max-line-length
        this.ngSnackbar.open('Please Enter a positive criteria for Preventive Maintenance.', 'OK', { duration: 2200, panelClass: 'alert-info' });
        return;
      }
      if (!!!this.assetGroup.controls.date.value ) {
          this.ngSnackbar.open('Please Choose a date for Preventive Maintenace.', 'OK', { duration: 2700, panelClass: 'alert-info' });
          return;
      }
    }
    for (const asset of this.assetList) {
      if (asset.assetName === this.assetGroup.controls.assetName.value) {
        this.ngSnackbar.open('Asset Name already exists.', 'OK', { duration: 2700, panelClass: 'alert-info' });
        return;
      }
    }
    this.makePayload();
  }

  makePayload() {
    this.weekdaysArray = [];
    this.weekendArray = [];
    if (this.assetGroup.controls.monday.value === true) {
      this.weekdaysArray.push(1);
    }
    if (this.assetGroup.controls.tuesday.value === true) {
      this.weekdaysArray.push(2);
    }
    if (this.assetGroup.controls.wednesday.value === true) {
      this.weekdaysArray.push(3);
    }
    if (this.assetGroup.controls.thrusday.value === true) {
      this.weekdaysArray.push(4);
    }
    if (this.assetGroup.controls.friday.value === true) {
      this.weekdaysArray.push(5);
    }
    if (this.assetGroup.controls.saturday.value === true) {
      this.weekdaysArray.push(6);
    }
    if (this.assetGroup.controls.sunday.value === true) {
      this.weekdaysArray.push(7);
    }
    // xxxxxxxxxxxxxxxxxxxxxxxxxxxx
    if (this.assetGroup.controls.weekendMonday.value === true) {
      this.weekendArray.push(1);
    }
    if (this.assetGroup.controls.weekendTuesday.value === true) {
      this.weekendArray.push(2);
    }
    if (this.assetGroup.controls.weekendWednesday.value === true) {
      this.weekendArray.push(3);
    }
    if (this.assetGroup.controls.weekendThrusday.value === true) {
      this.weekendArray.push(4);
    }
    if (this.assetGroup.controls.weekendFriday.value === true) {
      this.weekendArray.push(5);
    }
    if (this.assetGroup.controls.weekendSaturday.value === true) {
      this.weekendArray.push(6);
    }
    if (this.assetGroup.controls.weekendSunday.value === true) {
      this.weekendArray.push(7);
    }

    for (const weekDays of this.weekdaysArray) {
      for (const weekendDays of this.weekendArray) {
        if (weekDays === weekendDays) {
          this.ngSnackbar.open('Weekdays and weekends should not over lap', 'OK', { duration: 2200, panelClass: 'alert-info' });
          // console.log('days overlap');
          return;
        }
      }
    }

    if (this.assetGroup.controls.selectCriterion.value === 'By Usage - No. of trips') {
      this.assetGroup.controls.selectUnits.setValue('trips');
    }
    for (const site of this.siteList) {
      if (site.locId === this.assetGroup.controls.siteName.value) {
        this.finalSiteName = site.des;
        this.finalLocId = site.locId;
      }
    }
    if (this.assetGroup.controls.checkSiteOppHrs.value === true) {
      this.siteOperatingHours = true;
    } else {
      this.siteOperatingHours = false;
    }

    for (const block of this.blockList) {
      if (this.assetGroup.controls.wingBlock.value === block.bname) {
        this.finalZId = block.zid;
        this.finalBlockId = block.bid;
      }
    }
    

    this.asset = {
      assetCategory: this.assetGroup.controls.assetType.value,
      assetName: this.assetGroup.controls.assetName.value,
      assetId: this.assetGroup.controls.assetName.value,
      locId: this.finalLocId,
      siteName: this.finalSiteName,
      bname: this.assetGroup.controls.wingBlock.value,
      bid: this.finalBlockId,
      zid: this.finalZId,
      bottomFloor: this.assetGroup.controls.bottomFloor.value,
      topFloor: this.assetGroup.controls.topFloor.value,
      oemName: this.assetGroup.controls.selectOEM.value ? this.assetGroup.controls.selectOEM.value : '',
      oemModelName: this.assetGroup.controls.oemModelName.value ? this.assetGroup.controls.oemModelName.value : '',
      status: 'new',
      description: this.assetGroup.controls.assetDescription.value,
      siteOperatingHours: this.siteOperatingHours,
      enabled: true,
      devices: [
        {
          devName: '',
          devType: '',
          devId: ''
        }
      ],
      opHours: {
        weekdays: {
          time: {
            from: {
              hh: this.assetGroup.controls.weekdaysFromHours.value,
              mm: this.assetGroup.controls.weekdaysFromMins.value,
              meridiem: this.assetGroup.controls.selectFromAmPm.value
            },
            to: {
              hh: this.assetGroup.controls.weekdaysToHours.value,
              mm: this.assetGroup.controls.weekdaysToMins.value,
              meridiem: this.assetGroup.controls.selectToAmPm.value
            }
          },
          days: this.weekdaysArray
        },
        weekend: {
          time: {
            from: {
              hh: this.assetGroup.controls.weekendFromHours.value,
              mm: this.assetGroup.controls.weekendFromMins.value,
              meridiem: this.assetGroup.controls.weekendSelectFromAmPm.value
            },
            to: {
              hh: this.assetGroup.controls.weekendToHours.value,
              mm: this.assetGroup.controls.weekendToMins.value,
              meridiem: this.assetGroup.controls.weekendSelectToAmPm.value
            }
          },
          days: this.weekendArray
        }
      },
      preventiveMaintenance: {
        criteria: this.assetGroup.controls.selectCriterion.value === '0' ? '' : this.assetGroup.controls.selectCriterion.value,
        units: this.assetGroup.controls.selectUnits.value === '0' ? '' : this.assetGroup.controls.selectUnits.value,
        value: !!!this.assetGroup.controls.unitValue.value ? null : this.assetGroup.controls.unitValue.value
      },
      // tslint:disable-next-line:max-line-length
      maintDt: this.assetGroup.controls.date.value ? (this.assetGroup.controls.date.value.getTime() - this.assetGroup.controls.date.value.getMilliseconds()) : '',
      date: this.assetGroup.controls.date.value ? this.assetGroup.controls.date.value : ''
    };
    if (this.assetGroup.controls.selectOEM.value === 'Other') {
      this.asset.oemName = this.assetGroup.controls.otherOemName.value;
    }
    this.addAsset();
    return;

    if (this.breakCode === 1) {
      this.addAsset();
    }
    this.breakCode = 1;
  }

  addOemName() {
    this.onSpinner(true);
    this.addOemService.addOemName(this.assetGroup.controls.otherOemName.value).subscribe((res: any) => {
      this.onSpinner(false);
      this.getOemNames();
      this.assetGroup.controls.selectOEM.setValue(this.assetGroup.controls.otherOemName.value);
    }, (err) => {
      console.log(err);
      this.onSpinner(false);
    });
    this.isOEMButtonVisible = true;
  }

  addAsset() {
    this.onSpinner(true);
    console.log(this.asset);
    this.assetManagerService.addAsset(this.asset).subscribe((res: any) => {
      this.onSpinner(false);
      this.ngSnackbar.open(res.message, 'OK', { duration: 2000, panelClass: 'snackbar-success' });
      // window.location.reload();
    }, (err: any) => {
      console.log(err);
      this.onSpinner(false);
      this.ngSnackbar.open('Could not Add Asset. Please try again later.', 'OK', { duration: 3200, panelClass: 'alert-info' });
    });
    this.ngOnInit();
  }

  getOemNames() {
    this.onSpinner(true);
    this.addOemService.getOemNames().subscribe((res: any) => {
      for ( const oemName of res ) {
        this.oemNameList.push({ oemName: oemName.name});
      }
      this.onSpinner(false);
      console.log(res);
    });
  }

  getBlock(siteName: string) {
    if ( siteName === '0' ) {
      this.assetGroup.controls.siteName.setValue('0');
      return;
    }
    console.log(siteName);
    this.siteOpHours(siteName);
    this.onSpinner(true);
    this.getSite(siteName);
    console.log(this.selectedSite);
    this.assetGroup.controls.siteName.setValue(this.selectedSite.locId);
    if (siteName !== undefined) {
      const locIdObj = {
        locId: this.selectedSite.locId
      };
      this.assetManagerService.getBlock(locIdObj).subscribe((res: any) => {
        if (!!!res.data[0]) {
          // tslint:disable-next-line:max-line-length
          this.ngSnackbar.open('There is no Wing/Block assocoated with this site. Please select another site.', 'OK', { duration: 3500, panelClass: 'alert-info'});
        } else {
          // this.finalZId = res.data[0].
          // this.finalBlockId = res.data[0].bid;
          // console.log('bid is ' +  res.data[0].bid);
          this.blockList = res.data;
        }
        this.onSpinner(false);
      }, err => {
        this.onSpinner(false);
        console.log(err);
      });
    }
  }

  getSites() {
    this.sitesService.getSites().subscribe((res: any) => {
      this.onSpinner(true);
      this.siteList = res;
      this.onSpinner(false);
    }, err => {
      this.onSpinner(false);
      console.log(err);
    });
  }

  addWnigBlock(newBlock: string) {
    if (!!!this.selectedSite) {
      this.ngSnackbar.open('Please Select Site First', 'OK', { duration: 2200, panelClass: 'alert-info' });
      return;
    }
    this.onSpinner(true);
    const block = {
      zid: this.selectedSite.zid,
      locId: this.selectedSite.locId,
      bname: this.assetGroup.controls.newWingBlock.value,
      createdAt: new Date(),
      createdBy: localStorage.getItem('upUserEntity')
    };
    this.assetManagerService.addBlock(block).subscribe((res: any) => {
      this.isButtonVisible = true;
      this.newBid = newBlock;
      this.ngOnInit();
      this.getBlock(this.selectedSite.siteName);
      this.onSpinner(false);
      this.ngSnackbar.open(res.message, 'OK', { duration: 2000, panelClass: 'snackbar-success' });
    }, err => {
      this.onSpinner(false);
      console.log(err);
      this.ngSnackbar.open(err, 'OK', { duration: 2000, panelClass: 'alert-info' });
    });
    this.newBid = newBlock;

    this.newBname = newBlock;
    this.newBid = newBlock;
    this.onSpinner(false);
    // this.getBlock(this.recentSelectedSite);
    this.getExistingAsset(this.recentSelectedAsset);
  }

  getAssetData() {
    this.onSpinner(true);
    this.assetManagerService.getAsset().subscribe((res: any) => {
      this.getSites();
      this.assetList = res.data;
      this.onSpinner(false);
    }, err => {
      this.onSpinner(false);
      console.log(err);
    });
  }

  getExistingAsset(assetId: string) {
    this.recentSelectedAsset = assetId;
    console.log(assetId + 'caled');
    const assetIdObj = {
      assetId
    };
    if (assetId && assetId !== '0') {
      this.onSpinner(true);
      this.assetManagerService.getAssetDetail(assetIdObj).subscribe((res: any) => {
        this.assetDetail = res.data[0];
        console.log(res.data[0]);
        this.assetGroup.controls.wingBlock.setValue(res.data[0].bname);
        this.assetGroup.controls.bottomFloor.setValue(res.data[0].bottomFloor);
        this.assetGroup.controls.topFloor.setValue(res.data[0].topFloor);
        this.assetGroup.controls.siteName.setValue(res.data[0].siteName);
        this.assetGroup.controls.assetType.setValue(res.data[0].assetCategory);
        this.assetGroup.controls.selectOEM.setValue(res.data[0].oemName);
        this.assetGroup.controls.oemModelName.setValue(res.data[0].oemModelName);
        this.assetGroup.controls.weekdaysFromHours.setValue(res.data[0].opHours.weekdays.time.from.hh);
        this.assetGroup.controls.weekdaysFromMins.setValue(res.data[0].opHours.weekdays.time.from.mm);
        this.assetGroup.controls.weekdaysToHours.setValue(res.data[0].opHours.weekdays.time.to.hh);
        this.assetGroup.controls.weekdaysToMins.setValue(res.data[0].opHours.weekdays.time.to.mm);
        this.assetGroup.controls.selectFromAmPm.setValue(res.data[0].opHours.weekdays.time.from.meridiem);
        this.assetGroup.controls.selectToAmPm.setValue(res.data[0].opHours.weekdays.time.to.meridiem);
        this.assetGroup.controls.weekendFromHours.setValue(res.data[0].opHours.weekend.time.from.hh);
        this.assetGroup.controls.weekendFromMins.setValue(res.data[0].opHours.weekend.time.from.mm);
        this.assetGroup.controls.weekendToHours.setValue(res.data[0].opHours.weekend.time.to.hh);
        this.assetGroup.controls.weekendToMins.setValue(res.data[0].opHours.weekend.time.to.mm);
        this.assetGroup.controls.weekendSelectFromAmPm.setValue(res.data[0].opHours.weekend.time.from.meridiem);
        this.assetGroup.controls.weekendSelectToAmPm.setValue(res.data[0].opHours.weekend.time.to.meridiem);
        for (const day of res.data[0].opHours.weekdays.days) {
          if (day === 1) {
            this.assetGroup.controls.monday.setValue(true);
          } else if (day === 2) {
            this.assetGroup.controls.tuesday.setValue(true);
          } else if (day === 3) {
            this.assetGroup.controls.wednesday.setValue(true);
          } else if (day === 4) {
            this.assetGroup.controls.thrusday.setValue(true);
          } else if (day === 5) {
            this.assetGroup.controls.friday.setValue(true);
          } else if (day === 6) {
            this.assetGroup.controls.saturday.setValue(true);
          } else if (day === 7) {
            this.assetGroup.controls.sunday.setValue(true);
          }
        }
        for (const day of res.data[0].opHours.weekend.days) {
          if (day === 1) {
            this.assetGroup.controls.weekendMonday.setValue(true);
          } else if (day === 2) {
            this.assetGroup.controls.weekendTuesday.setValue(true);
          } else if (day === 3) {
            this.assetGroup.controls.weekendWednesday.setValue(true);
          } else if (day === 4) {
            this.assetGroup.controls.weekendThrusday.setValue(true);
          } else if (day === 5) {
            this.assetGroup.controls.weekendFriday.setValue(true);
          } else if (day === 6) {
            this.assetGroup.controls.weekendSaturday.setValue(true);
          } else if (day === 7) {
            this.assetGroup.controls.weekendSunday.setValue(true);
          }
        }
        this.wingBlock = res.data[0].bname;
        this.onSpinner(false);

        // ************** Initializing values*****************
        this.site = this.assetDetail.locId;
        this.getBlock(this.assetDetail.locId);
        // this.getBlock(this.assetDetail.locId);
        let temp = 1;
        if (this.oemName !== 'Other') {
          this.isOtherOemName = false;
        }
        this.tempOemName = this.assetDetail.oemName;
        for (let i = 0; i < this.oemNameList.length; i++) {
          if (this.oemNameList[i].oemName === this.assetDetail.oemName) {
            this.selectOEM = this.assetDetail.oemName;
            temp = 0;
            this.isOtherOemName = false;
            break;
          }
        }
        if (temp === 1) {
          this.isOtherOemName = true;
          this.otherOemName = this.tempOemName;
          this.selectOEM = 'Other';
        }
        // Operating Hours
        this.oemModelName = this.assetDetail.oemModelName;
      }, err => {
        this.onSpinner(false);
        console.log(err);
      });
    }
  }


  // ***************************selected Site***************************
  getSite(siteName: string) {
    for (let i = 0; i < this.siteList.length; i++) {
      if (this.siteList[i].locId === siteName) {
        this.selectedSite = this.siteList[i];
      }
    }
  }

  siteOpHours(siteName?: string) {
    console.log('in site op hrs' + siteName);
    if (siteName !== undefined) {
      console.log('safd e' + siteName);
      this.assetGroup.controls.siteName.setValue(siteName);
    }
    console.log('site.locId' + this.assetGroup.controls.siteName.value);
    if (siteName || this.assetGroup.controls.checkSiteOppHrs.value === false) {
      for (const site of this.siteList) {
        this.assetGroup.controls.monday.setValue(false);
        this.assetGroup.controls.tuesday.setValue(false);
        this.assetGroup.controls.wednesday.setValue(false);
        this.assetGroup.controls.thrusday.setValue(false);
        this.assetGroup.controls.friday.setValue(false);
        this.assetGroup.controls.saturday.setValue(false);
        this.assetGroup.controls.sunday.setValue(false);
        this.assetGroup.controls.weekendMonday.setValue(false);
        this.assetGroup.controls.weekendTuesday.setValue(false);
        this.assetGroup.controls.weekendWednesday.setValue(false);
        this.assetGroup.controls.weekendThrusday.setValue(false);
        this.assetGroup.controls.weekendFriday.setValue(false);
        this.assetGroup.controls.weekendSaturday.setValue(false);
        this.assetGroup.controls.weekendSunday.setValue(false);
        /* istanbul ignore next */
        if (site.locId === this.assetGroup.controls.siteName.value) {
          console.log('in in' + this.assetGroup.controls.siteName.value);
          this.assetGroup.controls.weekdaysFromHours.setValue(site.opHours.weekdays.time.from.hh);
          this.assetGroup.controls.weekdaysFromMins.setValue(site.opHours.weekdays.time.from.mm);
          this.assetGroup.controls.selectFromAmPm.setValue(site.opHours.weekdays.time.from.meridiem);
          this.assetGroup.controls.weekdaysToHours.setValue(site.opHours.weekdays.time.to.hh);
          this.assetGroup.controls.weekdaysToMins.setValue(site.opHours.weekdays.time.to.mm);
          this.assetGroup.controls.selectToAmPm.setValue(site.opHours.weekdays.time.to.meridiem);
          this.assetGroup.controls.weekendFromHours.setValue(site.opHours.weekend.time.from.hh);
          this.assetGroup.controls.weekendFromMins.setValue(site.opHours.weekend.time.from.mm);
          this.assetGroup.controls.weekendSelectFromAmPm.setValue(site.opHours.weekend.time.from.meridiem);
          this.assetGroup.controls.weekendToHours.setValue(site.opHours.weekend.time.to.hh);
          this.assetGroup.controls.weekendToMins.setValue(site.opHours.weekend.time.to.mm);
          this.assetGroup.controls.weekendSelectToAmPm.setValue(site.opHours.weekend.time.to.meridiem);
          for (const weekday of site.opHours.weekdays.days) {
            if (weekday === 1) {
              this.assetGroup.controls.monday.setValue(true);
            } else if (weekday === 2) {
              this.assetGroup.controls.tuesday.setValue(true);
            } else if (weekday === 3) {
              this.assetGroup.controls.wednesday.setValue(true);
            } else if (weekday === 4) {
              this.assetGroup.controls.thrusday.setValue(true);
            } else if (weekday === 5) {
              this.assetGroup.controls.friday.setValue(true);
            } else if (weekday === 6) {
              this.assetGroup.controls.saturday.setValue(true);
            } else if (weekday === 7) {
              this.assetGroup.controls.sunday.setValue(true);
            }
          }
          for (const weekend of site.opHours.weekend.days) {
            if (weekend === 1) {
              this.assetGroup.controls.weekendMonday.setValue(true);
            } else if (weekend === 2) {
              this.assetGroup.controls.weekendTuesday.setValue(true);
            } else if (weekend === 3) {
              this.assetGroup.controls.weekendWednesday.setValue(true);
            } else if (weekend === 4) {
              this.assetGroup.controls.weekendThrusday.setValue(true);
            } else if (weekend === 5) {
              this.assetGroup.controls.weekendFriday.setValue(true);
            } else if (weekend === 6) {
              this.assetGroup.controls.weekendSaturday.setValue(true);
            } else if (weekend === 7) {
              this.assetGroup.controls.weekendSunday.setValue(true);
            }
          }
          return;
        }
      }
    }
  }

  hideOtherOemName(oemName: string) {
    console.log(this.oemNameList);
    if (oemName !== 'Other') {
      this.isOtherOemName = false;
    }
  }

  onSpinner(bool: boolean) {
    setTimeout(() => {
      this.spinner.onRBSpinner$(bool);
    });
  }

}
