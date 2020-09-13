import { ViewAssetService } from 'src/app/Core/Service/view-asset.service';
import { Component, OnInit } from '@angular/core';
import { weekdays } from 'moment';
import { Validators, FormGroup, FormControl, NgForm } from '@angular/forms';
import { AssetManagerService } from 'src/app/Core/Service/asset-manager.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RbSpinnerService } from 'src/app/Core/Service/rb-spinner.service';
import { MatSnackBar } from '@angular/material';
import { SitesService } from 'src/app/Core/Service/sites.service';
import { AddOEMService } from 'src/app/Core/Service/add-oem.service';
// import *  as  data from 'src/assets/json/oemName.json';

@Component({
  selector: 'app-view-asset-details',
  templateUrl: './view-asset-details.component.html',
  styleUrls: ['./view-asset-details.component.scss']
})
export class ViewAssetDetailsComponent implements OnInit {
  public oemNameList: any[] = [];
  public isButtonVisible = true;
  public isOemButtonVisible = true;
  public isEditable = true;
  public selectCriterion = 'Fixed Frequency';
  public selectAssetType = 'Elevator';
  public selectDays = 'Weekend';
  public checkSiteOppHrs;
  public isChecked;
  selectOEM;
  _ModuleType;
  days;
  model;
  otherOemName;
  isDisabled;
  newWingBlock;
  childmessage;
  siteList;
  public blockList;
  assetDetail;
  wingBlock;
  tempLocId;
  tempBid;
  assetDescription;

  public monday;
  public tuesday;
  public thrusday;
  public wednesday;
  public friday;
  public saturday;
  public sunday;
  breakCode = 1;
  prevMainValue: any;
  prevMainUnit: any;
  oemName: any;
  public operatingHours = new Array;
  asset: any;
  isOtherOemName = false;
  tempOemName;
  // getBid;
  visibleEnd = 'block';
  visibleDays = 'block';
  selectedSite: any;
  newBid: string;
  tempSiteName;
  newBname: string;
  bname: any;
  tempBname: any;
  defaultBlock: any;
  defaultLocId: any;
  defaultBId: any;
  defaultBname: any;
  defaultSiteName: any;
  defaultSite: any;
  defaultZid: any;
  defaultBidForUi: any;
  constructor(private viewAssetService: ViewAssetService, private router: Router, private http: HttpClient,
              private assetManagerService: AssetManagerService, private addOemService: AddOEMService,
              private spinner: RbSpinnerService, private ngSnackbar: MatSnackBar, private sitesService: SitesService) { }

  assetDetails: any;
  weekdaysArray = new Array;
  weekendArray = new Array;
  fromH;
  fromM;
  fromAmPm;
  toH;
  toM;
  toAmPm;
  fromHEnd;
  fromMEnd;
  fromAmPmEnd;
  toHEnd;
  toMEnd;
  toAmPmEnd;
  firstTime;

  ngOnInit() {
    this.getOemNames();
    console.log(this.isEditable);
    this.viewAssetService.currentAssetDetails.subscribe((res: any) => {
      console.log(res);

      this.assetDetail = res;
      this.defaultBidForUi = res.bid;
      this.defaultLocId = this.assetDetail.locId;
      this.defaultBId = this.assetDetail.bid;
      this.defaultBname = this.assetDetail.bname;
      this.defaultSiteName = this.assetDetail.siteName;
      this.defaultZid = this.assetDetail.zid;
      // this.getSites();
      // this.getBlockName(this.assetDetail.bid);

      if (this.assetDetail.maintDt === null) {
        console.log('date is null');
      } else {
        this.assetDetail.maintDt = new Date(this.assetDetail.maintDt);
      }

      // if (this.assetDetail.oemName !== 'Other') {
      //   this.isOtherOemName = false;
      // }
      this.tempOemName = this.assetDetail.oemName;
      // **********************selecting days*******************//
      for (let i = 0; i < this.assetDetail.opHours.weekend.days.length; i++) {
        if (this.assetDetail.opHours.weekend.days[i] === 1) {
          this.monday = true;
        }
        if (this.assetDetail.opHours.weekend.days[i] === 2) {
          this.tuesday = true;
        }
        if (this.assetDetail.opHours.weekend.days[i] == 3) {
          this.wednesday = true;
        }
        if (this.assetDetail.opHours.weekend.days[i] == 4) {
          this.thrusday = true;
        }
        if (this.assetDetail.opHours.weekend.days[i] == 5) {
          this.friday = true;
        }
        if (this.assetDetail.opHours.weekend.days[i] == 6) {
          this.saturday = true;
        }
        if (this.assetDetail.opHours.weekend.days[i] == 7) {
          this.sunday = true;
        }
      }

      this.weekdaysArray = this.assetDetail.opHours.weekdays.days;
      this.weekendArray = this.assetDetail.opHours.weekend.days;

    }, err => {
      console.log(err);
    });
    let temp = 1;
      // *************** filling oemName ****************
    for (let i = 0; i < this.oemNameList.length; i++) {
        if (this.oemNameList[i].oemName === this.assetDetail.oemName) {
          console.log('finding other name');
          temp = 0;
          break;
        }
      }
    if (temp === 1) {
        this.isOtherOemName = true;
        console.log('found other name');
        this.otherOemName = this.tempOemName;
        this.assetDetail.oemName = 'Other';
      }


    this.getSites();
    this.getBlockName(this.assetDetail.bid);
  }

  len;

  getSites() {
    console.log('get sites is called');
    this.sitesService.getSites().subscribe((res: any) => {
      this.siteList = res;
      this.getBlock(this.defaultLocId, 0);
      this.getBlock(this.defaultLocId, 0);
      console.log(res);
      this.len = res.length;
      this.onSpinner(false);
    }, err => {
      console.log(err);
      this.onSpinner(false);
    });
  }


  getBlock(siteName: string, num: number) {
    // if(num === 1){
    //   this.defaultBidForUi = null;
    // }
    console.log(siteName + '..................');
    this.defaultSite = this.siteList.find(ele => ele.locId === siteName);
    console.log((this.siteList.find(ele => ele.locId === siteName)).siteName);
    if (siteName !== undefined) {
      const locIdObj = {
        locId: siteName
      };
      console.log(locIdObj);
      this.assetManagerService.getBlock(locIdObj).subscribe((res: any) => {
        console.log('block DATA');
        console.log(res.data);
        this.blockList = res.data;
        // this.tempBid = this.blockList[0].bid;
        this.onSpinner(false);
      }, err => {
        this.onSpinner(false);
        console.log(err);
      });
    }
    console.log('block DATA of blocklist');
        console.log(this.blockList);
  }

  getBlockName(block: any) {
    console.log('This is +' + block);
    console.log(this.blockList);
    this.defaultBlock = this.blockList.find(ele => ele.bid === block);
    this.defaultBname = this.defaultBlock.bname;
    console.log('printing Block'+this.defaultBname);
    
    console.log(this.blockList.find(ele => ele.bid === block).bname);
  }


  addWnigBlock(newBlock: string) {
    console.log('adding new block = ' + newBlock);
    if (!!!this.defaultSite) {
      this.ngSnackbar.open('Please Select Site First', 'OK', { duration: 2200, panelClass: 'alert-info' });
      return;
    }
    this.onSpinner(true);
    const block = {
      zid: this.defaultSite.zid,
      locId: this.defaultSite.locId,
      bname: newBlock,
      createdAt: new Date(),
      createdBy: localStorage.getItem('upUserEntity')
    };
    this.assetManagerService.addBlock(block).subscribe((res: any) => {
      this.isButtonVisible = true;
      this.onSpinner(false);
      this.getBlock(this.defaultSite.locId, 0);
      newBlock = '';
      this.ngSnackbar.open(res.message, 'OK', { duration: 2000, panelClass: 'snackbar-success' });
    }, err => {
      this.onSpinner(false);
      console.log(err);
      this.ngSnackbar.open(err, 'OK', { duration: 2000, panelClass: 'alert-info' });
    });
    this.onSpinner(false);
  }


  pushDays(day: any, index: number) {
    if (this.selectDays == 'Weekdays') {
      console.log('dat is ====' + day);

      if (day) {
        this.weekdaysArray.push(index);
        console.log('pushing-' + day + ' ,,,,,,,,' + index);
      } else if (!day) {
        let i = this.weekdaysArray.indexOf(index);
        if (i > -1) {
          this.weekdaysArray.splice(i, 1);
        }
        console.log('splicing-' + index);
      }
    }

    if (this.selectDays == 'Weekend') {
      if (day) {
        this.weekendArray.push(index);
      } else if (!day) {
        let i = this.weekendArray.indexOf(index);
        if (i > -1) {
          this.weekendArray.splice(i, 1);
        }
      }
    }
    console.log('weekdaysArray...' + this.weekdaysArray);
    console.log('weekEnd...' + this.weekendArray);
  }

  saveOpHoursData(day: string) {
    console.log('this. is day...' + day);
    if (day !== undefined) {
      if (day === 'Weekdays') {
        console.log('this. is day coming here...' + this.saturday + '......' + day);
        this.fromH = this.assetDetail.opHours.weekdays.time.from.hh;
        this.fromM = this.assetDetail.opHours.weekdays.time.from.mm;
        this.fromAmPm = this.assetDetail.opHours.weekdays.time.from.meridiem;
        this.toH = this.assetDetail.opHours.weekdays.time.to.hh;
        this.toM = this.assetDetail.opHours.weekdays.time.to.mm;
        this.toAmPm = this.assetDetail.opHours.weekdays.time.to.meridiem;
        console.log(this.fromH);
        this.visibleEnd = 'none';
        this.visibleDays = 'block';
        if (this.monday == undefined) {
          this.monday = true;
          this.weekdaysArray.push(1);
        }
        if (this.tuesday == undefined) {
          this.weekdaysArray.push(2);
          this.tuesday = true;
        }
        if (this.wednesday == undefined) {
          this.weekdaysArray.push(3);
          this.wednesday = true;
        }
        if (this.thrusday == undefined) {
          this.weekdaysArray.push(4);
          this.thrusday = true;
        }
        if (this.friday === undefined) {
          this.weekdaysArray.push(5);
          this.friday = true;
        }

      }
      if (day === 'Weekend') {

        this.fromHEnd = this.assetDetail.opHours.weekend.time.from.hh;
        this.fromMEnd = this.assetDetail.opHours.weekend.time.from.mm;
        this.fromAmPmEnd = this.assetDetail.opHours.weekend.time.from.meridiem;
        this.toHEnd = this.assetDetail.opHours.weekend.time.to.hh;
        this.toMEnd = this.assetDetail.opHours.weekend.time.to.mm;
        this.toAmPmEnd = this.assetDetail.opHours.weekend.time.to.meridiem;
        console.log(this.fromHEnd);
        this.visibleEnd = 'block';
        this.visibleDays = 'end';
      }
    }
  }

  logForm(value: any) {
    console.log('in the form');
    console.log(value);
    if (this.defaultBlock === undefined) {
      console.log('in here');
      this.getBlockName(this.assetDetail.bid);
    }

    value.selectDaysMonths = this.assetDetail.preventiveMaintenance.units;
    value.selectMinsHours = this.assetDetail.preventiveMaintenance.units;
    this.operatingHours = [];
    /**************************************
     * *****weekdays and weekend logic
     * ************************************/
    if (value.selectDays != 'Select Days') {
      console.log('values. days changing');
      if (this.monday) {
        value.monday = true;
      }
      if (this.tuesday) {
        value.tuesday = true;
      }
      if (this.wednesday) {
        value.wednesday = true;
      }
      if (this.thrusday) {
        value.thrusday = true;
      }
      if (this.friday) {
        value.friday = true;
      }
      if (this.saturday) {
        value.saturday = true;
      }
      if (this.sunday) {
        value.sunday = true;
      }
    }

    // pushing days to array
    if (value.monday == true) {
      this.operatingHours.push('monday');
    }
    if (value.tuesday == true) {
      this.operatingHours.push('tuesday');
    }
    if (value.wednesday == true) {
      this.operatingHours.push('wednesday');
    }
    if (value.thrusday == true) {
      this.operatingHours.push('thrusday');
    }
    if (value.friday == true) {
      this.operatingHours.push('friday');
    }
    if (value.saturday == true) {
      this.operatingHours.push('saturday');
    }
    if (value.sunday == true) {
      this.operatingHours.push('sunday');
    }

    if (value.selectCriterion == 'Fixed Frequency') {
      console.log('in 1');

      this.prevMainUnit = value.selectDaysMonths;
      this.prevMainValue = value.trips;
    }
    if (value.selectCriterion == 'By Usage - No. of trips') {
      console.log('in 2');
      this.prevMainUnit = 'trips';
      this.prevMainValue = value.trips;
    }
    if (value.selectCriterion == 'By Usage - Active time') {
      console.log('in 3');
      this.prevMainUnit = value.selectMinsHours;
      this.prevMainValue = value.trips;
    }
    console.log('array ' + this.operatingHours);

    console.log('printing values-');
    console.log(value);



    /*******************validations starts******************/

    if (value.topFloor <= value.bottomFloor) {
      this.breakCode = 0;
      this.ngSnackbar.open('Top floors should be greater than bottom floor.', 'OK', { duration: 3200, panelClass: 'alert-info' });
    }
    if (value.topFloor < 0 || value.bottomFloor > 1 || value.bottomFloor < -5) {
      this.breakCode = 0;
      this.ngSnackbar.open('Top Floor should be greater than -1. Bottom should be between -5 to 1.', 'OK', { duration: 4200, panelClass: 'alert-info' });
    }


    if (value.checkSiteOppHrs) {
      console.log('checkSitesOH...' + value.checkSiteOppHrs);
      console.log('checkSitesOH...' + this.defaultSite);

      value.fromHours = this.defaultSite.opHours.weekdays.time.from.hh;
      value.fromMins = this.defaultSite.opHours.weekdays.time.from.mm;
      value.selectFromAmPm = this.defaultSite.opHours.weekdays.time.from.meridiem;
      value.toHours = this.defaultSite.opHours.weekdays.time.to.hh;
      value.toMins = this.defaultSite.opHours.weekdays.time.to.mm;
      value.selectToAmPm = this.defaultSite.opHours.weekdays.time.to.meridiem;

      value.fromHoursEnd = this.defaultSite.opHours.weekend.time.from.hh;
      value.fromMinsEnd = this.defaultSite.opHours.weekend.time.from.mm;
      value.selectFromAmPmEnd = this.defaultSite.opHours.weekend.time.from.meridiem;
      value.toHoursEnd = this.defaultSite.opHours.weekend.time.to.hh;
      value.toMinsEnd = this.defaultSite.opHours.weekend.time.to.mm;
      value.selectToAmPmEnd = this.defaultSite.opHours.weekend.time.to.meridiem;

      console.log('if true weekDays' + this.defaultSite.opHours.weekdays.days);

      value.weekdaysArray = this.defaultSite.opHours.weekdays.days;
      value.weekendArray = this.defaultSite.opHours.weekend.days;

    }

    if (value.selectOEM == 'Other') {
      this.oemName = value.otherOemName;
    }
    if (value.selectOEM != 'Other') {
      this.oemName = value.selectOEM;
    }

    if (
      value.assetName == '' || value.assetName == undefined ||
      value.selectAssetCategory == '' || value.selectAssetCategory == undefined ||
      value.bottomFloor == undefined ||
      value.topFloor == undefined ||
      value.site == '' || value.site == undefined ||
      value.wingBlock == '' || value.wingBlock == undefined

    ) {
      this.breakCode = 0;
      console.log('invalid' + value.assetName + value.selectAssetCategory + '.......' + value.bottomFloor + '.......' + value.topFloor + value.site + value.wingBlock);
      this.ngSnackbar.open('Fill mandatory fields.', 'OK', { duration: 3200, panelClass: 'alert-info' });
    }

    if (!value.checkSiteOppHrs) {
      value.fromHours = this.assetDetail.opHours.weekdays.time.from.hh;
      value.fromMins = this.assetDetail.opHours.weekdays.time.from.mm;
      value.selectFromAmPm = this.assetDetail.opHours.weekdays.time.from.meridiem;
      value.toHours = this.assetDetail.opHours.weekdays.time.to.hh;
      value.toMins = this.assetDetail.opHours.weekdays.time.to.mm;
      value.selectToAmPm = this.assetDetail.opHours.weekdays.time.to.meridiem;

      value.fromHoursEnd = this.assetDetail.opHours.weekend.time.from.hh;
      value.fromMinsEnd = this.assetDetail.opHours.weekend.time.from.mm;
      value.selectFromAmPmEnd = this.assetDetail.opHours.weekend.time.from.meridiem;
      value.toHoursEnd = this.assetDetail.opHours.weekend.time.to.hh;
      value.toMinsEnd = this.assetDetail.opHours.weekend.time.to.mm;
      value.selectToAmPmEnd = this.assetDetail.opHours.weekend.time.to.meridiem;

      if (value.selectDays == 'Select Days') {
        this.breakCode = 0;
        this.ngSnackbar.open('Select Days - Weekdays or Weekend', 'OK', { duration: 3200, panelClass: 'alert-info' });
      }
      if (
        this.assetDetail.opHours.weekdays.time.from.hh == '' || this.assetDetail.opHours.weekdays.time.from.hh == undefined ||
        this.assetDetail.opHours.weekdays.time.from.mm == undefined ||
        this.assetDetail.opHours.weekdays.time.from.meridiem == '' || this.assetDetail.opHours.weekdays.time.from.meridiem == undefined ||
        this.assetDetail.opHours.weekdays.time.to.hh == '' || this.assetDetail.opHours.weekdays.time.to.hh == undefined ||
        this.assetDetail.opHours.weekdays.time.to.mm == undefined ||
        this.assetDetail.opHours.weekdays.time.to.meridiem == '' || this.assetDetail.opHours.weekdays.time.to.meridiem == undefined ||

        this.assetDetail.opHours.weekend.time.from.hh == '' || this.assetDetail.opHours.weekend.time.from.hh == undefined ||
        this.assetDetail.opHours.weekend.time.from.mm == undefined ||
        this.assetDetail.opHours.weekend.time.from.meridiem == '' || this.assetDetail.opHours.weekend.time.from.meridiem == undefined ||
        this.assetDetail.opHours.weekend.time.to.hh == '' || this.assetDetail.opHours.weekend.time.to.hh == undefined ||
        this.assetDetail.opHours.weekend.time.to.mm == undefined ||
        this.assetDetail.opHours.weekend.time.to.meridiem == '' || this.assetDetail.opHours.weekend.time.to.meridiem == undefined
      ) {
        this.breakCode = 0;
        this.ngSnackbar.open('Fill From & To operating hours.', 'OK', { duration: 9900, panelClass: 'alert-info' });
      }
      value.weekdaysArray = this.weekdaysArray;
      value.weekendArray = this.weekendArray;
    }

    if (value.selectCriterion === 'By Usage - No. of trips') {
      if (value.trips === undefined) {
        this.breakCode = 0;
        console.log('invalid........' + value.trips);
        this.ngSnackbar.open('Fill the no. of trips.', 'OK', { duration: 3200, panelClass: 'alert-info' });
       } else {
        if (value.date === undefined) {
          this.breakCode = 0;
          this.ngSnackbar.open('Select date', 'OK', { duration: 3200, panelClass: 'alert-info' });
        }
      }
    }
    if (value.selectCriterion === 'Fixed Frequency') {
      if (value.selectDaysMonths === undefined || value.trips === undefined) {
        this.breakCode = 0;
        console.log('invalid........' + value.selectDaysMonths);
        this.ngSnackbar.open('Enter value and select Days or Months.', 'OK', { duration: 3200, panelClass: 'alert-info' });
      } else {
        if (value.date === undefined) {
          this.breakCode = 0;
          this.ngSnackbar.open('Select date', 'OK', { duration: 3200, panelClass: 'alert-info' });
        }
      }
    }
    if (value.selectCriterion === 'By Usage - Active time') {
      if (value.selectMinsHours === undefined || value.trips === undefined) {
        this.breakCode = 0;
        console.log('invalid........' + value.selectMinsHours);
        this.ngSnackbar.open('Enter value and select Mins or Hours.', 'OK', { duration: 3200, panelClass: 'alert-info' });
      } else {
        if (value.date === undefined) {
          this.breakCode = 0;
          this.ngSnackbar.open('Select date', 'OK', { duration: 3200, panelClass: 'alert-info' });
        }
      }
    }

    /*******************validations ends******************/


    this.asset = {
      // _id: this.assetDetail._id,
      bname: this.defaultBlock.bname,
      siteName: this.defaultSite.siteName,
      locId: this.defaultSite.locId,
      bid: this.defaultBlock.bid,
      zid: this.defaultBlock.zid,
      assetName: value.assetName,
      assetCategory: value.selectAssetCategory,
      bottomFloor: value.bottomFloor,
      topFloor: value.topFloor,
      maintDt: value.date ? (value.date.getTime() - value.date.getMilliseconds()) : '',
      siteOperatingHours: value.checkSiteOppHrs,
      assetId: value.assetName,
      opHours: {
        weekdays: {
          time: {
            from: {
              hh: this.assetDetail.opHours.weekdays.time.from.hh,
              mm: this.assetDetail.opHours.weekdays.time.from.mm,
              meridiem: this.assetDetail.opHours.weekdays.time.from.meridiem
            },
            to: {
              hh: this.assetDetail.opHours.weekdays.time.to.hh,
              mm: this.assetDetail.opHours.weekdays.time.to.mm,
              meridiem: this.assetDetail.opHours.weekdays.time.to.meridiem
            }

          },
          days: value.weekdaysArray,
        },
        weekend: {
          time: {
            from: {
              hh: this.assetDetail.opHours.weekend.time.from.hh,
              mm: this.assetDetail.opHours.weekend.time.from.mm,
              meridiem: this.assetDetail.opHours.weekend.time.from.meridiem
            },
            to: {
              hh: this.assetDetail.opHours.weekend.time.to.hh,
              mm: this.assetDetail.opHours.weekend.time.to.mm,
              meridiem: this.assetDetail.opHours.weekend.time.to.meridiem
            }
          },
          days: value.weekendArray,
        }
      },
      preventiveMaintenance: {
        criteria: value.selectCriterion,
        value: this.prevMainValue,
        units: this.prevMainUnit
      },
      operatingHours: this.operatingHours,
      oemName: this.oemName,
      oemModelName: value.oemModelName
    };

    console.log('displaying asset');
    console.log(this.asset);

    if (this.breakCode === 1) {
      console.log(this.asset);
      this.updateAsset();
    }
    this.breakCode = 1;
  }

  updateAsset() {
    this.onSpinner(true);
    console.log('in update Asset');
    this.assetManagerService.updateAsset((this.asset)).subscribe((res: any) => {
      this.onSpinner(false);
      this.ngSnackbar.open(res.message, 'OK', { duration: 2000, panelClass: 'snackbar-success' });
      // this.router.navigate(['/home/corp/user/asset']);
    }, err => {
      console.log(err);
      this.onSpinner(false);
      this.ngSnackbar.open('' + err.error.message.Error, 'OK', { duration: 3200, panelClass: 'alert-info' });
    });
  }

  disable(f) {
    f.form.disable();
  }
  editable() {
    this.isEditable = false;
  }

  changeDays(selectDay) {
    if (selectDay == 'Weekdays') {
      this.fromH = this.assetDetail.opHours.weekdays.time.from.hh;
      this.fromM = this.assetDetail.opHours.weekdays.time.from.mm;
      this.fromAmPm = this.assetDetail.opHours.weekdays.time.from.meridiem;
      this.toH = this.assetDetail.opHours.weekdays.time.to.hh;
      this.toM = this.assetDetail.opHours.weekdays.time.to.mm;
      this.toAmPm = this.assetDetail.opHours.weekdays.time.to.meridiem;
      console.log(this.fromH);
      this.visibleEnd = 'none';
      this.visibleDays = 'block';
      this.monday = false;
      this.tuesday = false;
      this.wednesday = false;
      this.thrusday = false;
      this.friday = false;
      this.saturday = false;
      this.sunday = false;
      for (let i = 0; i < this.assetDetail.opHours.weekdays.days.length; i++) {
        if (this.assetDetail.opHours.weekdays.days[i] == 1) {
          this.monday = true;
        }
        if (this.assetDetail.opHours.weekdays.days[i] == 2) {
          this.tuesday = true;
        }
        if (this.assetDetail.opHours.weekdays.days[i] == 3) {
          this.wednesday = true;
        }
        if (this.assetDetail.opHours.weekdays.days[i] == 4) {
          this.thrusday = true;
        }
        if (this.assetDetail.opHours.weekdays.days[i] == 5) {
          this.friday = true;
        }
        if (this.assetDetail.opHours.weekdays.days[i] == 6) {
          this.saturday = true;
        }
        if (this.assetDetail.opHours.weekdays.days[i] == 7) {
          this.sunday = true;
        }
      }


    } else if (selectDay == 'Weekend') {

      this.fromHEnd = this.assetDetail.opHours.weekend.time.from.hh;
      this.fromMEnd = this.assetDetail.opHours.weekend.time.from.mm;
      this.fromAmPmEnd = this.assetDetail.opHours.weekend.time.from.meridiem;
      this.toHEnd = this.assetDetail.opHours.weekend.time.to.hh;
      this.toMEnd = this.assetDetail.opHours.weekend.time.to.mm;
      this.toAmPmEnd = this.assetDetail.opHours.weekend.time.to.meridiem;
      console.log(this.fromHEnd);
      this.visibleEnd = 'block';
      this.visibleDays = 'end';
      this.visibleEnd = 'block';
      this.monday = false;
      this.tuesday = false;
      this.wednesday = false;
      this.thrusday = false;
      this.friday = false;
      this.saturday = false;
      this.sunday = false;
      for (let i = 0; i < this.assetDetail.opHours.weekend.days.length; i++) {
        if (this.assetDetail.opHours.weekend.days[i] == 1) {
          this.monday = true;
        }
        if (this.assetDetail.opHours.weekend.days[i] == 2) {
          this.tuesday = true;
        }
        if (this.assetDetail.opHours.weekend.days[i] == 3) {
          this.wednesday = true;
        }
        if (this.assetDetail.opHours.weekend.days[i] == 4) {
          this.thrusday = true;
        }
        if (this.assetDetail.opHours.weekend.days[i] == 5) {
          this.friday = true;
        }
        if (this.assetDetail.opHours.weekend.days[i] == 6) {
          this.saturday = true;
        }
        if (this.assetDetail.opHours.weekend.days[i] == 7) {
          this.sunday = true;
        }
      }
    }
  }

  hideOtherOemName(oemName: string) {
    if (oemName !== 'Other') {
      console.log('it is called');
      this.isOtherOemName = false;
    }
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

  addNewOemName(otherOemName: string) {
    this.onSpinner(true);
    this.addOemService.addOemName(otherOemName).subscribe((res: any) => {
      console.log(res);
      this.onSpinner(false);
      this.getOemNames();
    }, (err) => {
      console.log(err);
      this.onSpinner(false);
    });
    this.isOemButtonVisible = true;
  }

  onSpinner(bool: boolean) {
    setTimeout(() => {
      this.spinner.onRBSpinner$(bool);
    });
  }

}
