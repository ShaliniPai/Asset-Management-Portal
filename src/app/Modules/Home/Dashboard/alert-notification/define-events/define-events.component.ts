import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatRadioChange, MatCheckboxChange, MatSnackBar, MatRadioButton } from '@angular/material';
import { IFTreeConfigDataModel } from '../../../treeView/interface.treehierarchy';
import { Router } from '@angular/router';
import { AlertsNotifServiceComponent } from 'src/app/Core/Service/alerts-notification.service';
import { environment } from 'src/environments/environment';
import { RbSpinnerService } from 'src/app/Core/Service/rb-spinner.service';

@Component({
  selector: 'app-define-events',
  templateUrl: './define-events.component.html',
  styleUrls: ['./define-events.component.scss']
})
export class DefineEventsComponent implements OnInit {
  myGroup: FormGroup;
  fg: FormGroup;
  classReset = 'boschlight';
  classButton = 'boschdark';
  toppingList: any;
  isDisable = false;
  isDisable1 = true;
  isDisable2 = true;
  isDisable3 = true;
  isDisable4 = false;
  isDisable5 = true;
  isDisable6 = true;
  isOpenedSideAsset = false;
  isCriteriaEnable = true;
  isParamEnable = false;
  param = '';
  oLevel1 = '0';
  oLevel11 = '0';
  oLevel12 = '0';
  oLevel2 = '0';
  oLevel3 = '0';
  isLevelenable = false;
  isSMSenable = false;
  isEmailenable = false;
  smsCheck = '';
  emailCheck = '';
  PerDuration = 120;                                                  //  Input of Persistence Duration
  DisablePer = true;                                                  // Disable Persistence Input if only one username is selected
  Text = 'Optional';                 // 'Optional' Text will be removed from Persistence Duration after second username is selected
  PerClass = 'disableDiv';
  Category: any;
  idleLongerThan: any;
  DurationValue: any;
  AssetOnDuringNonOp: any;
  utilizationLess: any;
  downtimePerDay: any;
  energyPerDay: any;
  utilizationLessThan: any;
  mtValue = '';
  opDuringNonop: any;
  notifArray: string[] = [];                                             // Array to contain SMS or Email Selection or both
  opDuringNonopDuration: any;                                            // Input of operational during non-op hours
  a1: string[];                                                          // for splitting usernames
  a2: string[];
  stop: boolean;                                                         // if stop is true, will not call API
  userPush: string[];
  errorEmail = false;
  downtimePerDayDuration: any;
  assetObjectIdTemp: any;
  disableLevel1 = false;
  assetSelected = false;
  criteriaForCurrentDay = 'I-L';
  criteriaForLastSandTDays = 'D-D';
  assetName: string;
  type: string;
  createAlertResponse: any;
  thresholdDuration: any;
  usersList: [];
  emailList: [];
  treeData: any;
  isEnableSpinner = true;
  isAssetEnable = false;
  isRequireToResetTree: boolean;

  treeViewConfig: IFTreeConfigDataModel = {
    // url: '/assets/json/mock.assets.json',
    url: environment.alertNotifications + '/api/assets/getAssets',
    dataModel: [
      { valCol: 'tenantId', textCol: 'tenantName', isNotColumns: false },
      { valCol: 'zid', textCol: 'zname', isNotColumns: false },
      { valCol: 'bid', textCol: 'bname', isNotColumns: false },
      { valCol: 'locId', textCol: 'locName', isNotColumns: false },
      { valCol: 'assetId', textCol: 'assetName', isNotColumns: false },
    ]
  };

  constructor(private fb: FormBuilder, private ngSnackbar: MatSnackBar, private router: Router,
              private alerts$: AlertsNotifServiceComponent, private spinner: RbSpinnerService) { }

  ngOnInit() {
    this.getAssetsData();
    this.getUsersData();

    this.toppingList = ['Toyota', 'Mercedes', 'BMW', 'Ferrari', 'Lamborghini', 'Aston Martin', 'Toyota'];
    this.fg = this.fb.group({
      criteria: ['', Validators.required],
      window: ['currentDay', Validators.required],
      duration: ['', Validators.required],
      th1: ['', Validators.required],
      th2: ['', Validators.required],
      th3: ['', Validators.required],
      th4: ['', Validators.required],
      th5: ['', Validators.required],
      th6: ['', Validators.required],
      th7: ['', Validators.required],
      per: [{value: 120, disabled: true}, Validators.required],
      Check1: ['', Validators.required],
      Check2: ['', Validators.required],
      level1: ['0', Validators.required],
      level11: ['0', Validators.required],
      level12: ['0', Validators.required],
      level2: ['0', Validators.required],
      level3: ['0', Validators.required],
      });
  }

  getAssetsData() {
    this.onSpinner(true);
    this.alerts$.fs_getAssets().subscribe((res: any) => {
      this.treeData = res;
      this.onSpinner(false);
      console.log(this.treeData);
    }, (err) => {
      console.log(err);
      this.onSpinner(false);
});
  }
  getUsersData() {
    this.alerts$.fs_getUsers().subscribe((res: any) => {
      this.usersList = res;
    });
  }

  onChange(mrChange: MatRadioChange) {
   console.log(mrChange.value);
  }

  onChange1(mrChange: MatRadioChange) {
    if (this.isCriteriaEnable === false) {
      this.isCriteriaEnable = true;
    }
    this.Category = mrChange.value;
    if (mrChange.value === 'I-L') {
      this.isDisable = false;
      this.isDisable1 = true;
      this.isDisable2 = true;
      this.isDisable3 = true;
    } else if (mrChange.value === 'D-L') {
      this.isDisable = true;
      this.isDisable1 = false;
      this.isDisable2 = true;
      this.isDisable3 = true;
    } else if (mrChange.value === 'A-O') {
      this.isDisable = true;
      this.isDisable1 = true;
      this.isDisable2 = false;
      this.isDisable3 = true;
    } else if (mrChange.value === 'U-L') {
      this.isDisable = true;
      this.isDisable1 = true;
      this.isDisable2 = true;
      this.isDisable3 = false;
    }
  }

  onChange2(mrChange: MatRadioChange) {
    if (this.isCriteriaEnable === false) {
      this.isCriteriaEnable = true;
    }
    this.Category = mrChange.value;
    if (mrChange.value === 'D-D') {
      this.isDisable4 = false;
      this.isDisable5 = true;
      this.isDisable6 = true;
    } else if (mrChange.value === 'E-D') {
      this.isDisable4 = true;
      this.isDisable5 = false;
      this.isDisable6 = true;
    } else if (mrChange.value === 'U-LT') {
      this.isDisable4 = true;
      this.isDisable5 = true;
      this.isDisable6 = false;
    }
  }

  // On click of SMS checkbox
  onChangeCheck1(mc: MatCheckboxChange) {
    if (mc.checked === true) {
      this.smsCheck = mc.source.value;
      this.isSMSenable = true;
    } else {
      this.isSMSenable = false;
      this.smsCheck = '';
    }
  }
  // On click of email checkbox
  onChangeCheck2(mc: MatCheckboxChange) {
    if (mc.checked === true) {
      this.emailCheck = mc.source.value;
      this.isEmailenable = true;
    } else {
      this.isEmailenable = false;
      this.emailCheck = '';
    }
  }

  // On clicking reset button, things that should get reset
  reset() {
    this.isSMSenable = false;
    this.isEmailenable = false;
    this.isLevelenable = false;
    this.isRequireToResetTree = true;
    setTimeout(() => {
      this.isRequireToResetTree = false;
    });
    // this.isAssetEnable = false;
    this.criteriaForCurrentDay = 'I-L';
    this.criteriaForLastSandTDays = 'D-D';
    this.fg.controls.window.setValue('currentDay');
    this.fg.controls.th1.reset();
    this.fg.controls.th2.reset();
    this.fg.controls.th3.reset();
    this.fg.controls.th4.reset();
    this.fg.controls.th5.reset();
    this.fg.controls.th6.reset();
    this.fg.controls.th7.reset();
    this.fg.controls.Check1.reset();
    this.fg.controls.Check2.reset();
    this.fg.controls.per.setValue(120);
    this.fg.controls.per.disable();
    this.fg.controls.level1.setValue('0');
    this.fg.controls.level11.setValue('0');
    this.fg.controls.level12.setValue('0');
    this.fg.controls.level2.setValue('0');
    this.fg.controls.level3.setValue('0');
    this.isDisable = false;
    this.isDisable1 = true;
    this.isDisable2 = true;
    this.isDisable3 = true;
    this.isDisable4 = false;
    this.isDisable5 = true;
    this.isDisable6 = true;
    this.DisablePer = true;
    this.PerClass = 'disableDiv';
    this.classButton = 'boschdark';
  }

  // Function gets called after Level 1's 1st dropdown is selected
  Level1(event: string) {
    if (event === '0' && this.fg.controls.level11.value === '0' && this.fg.controls.level12.value === '0') {
      this.isLevelenable = false;
      this.fg.controls.level2.setValue('0');
      this.fg.controls.level3.setValue('0');
      this.fg.controls.per.disable();
      this.PerClass = 'disableDiv';
      this.DisablePer = true;
      this.fg.controls.per.setValue(120);
      this.Text = 'Optional';
    } else {
      this.isLevelenable = true;
      }
  }
  // Function gets called after Level 1's 2nd dropdown is selected
  Level11(event: string) {
    if (event === '0' && this.fg.controls.level1.value === '0' && this.fg.controls.level12.value === '0') {
      this.isLevelenable = false;
      this.fg.controls.level2.setValue('0');
      this.fg.controls.level3.setValue('0');
      this.fg.controls.per.disable();
      this.PerClass = 'disableDiv';
      this.DisablePer = true;
      this.fg.controls.per.setValue(120);
      this.Text = 'Optional';
    } else {
      this.isLevelenable = true;
      }
  }
  // Function gets called after Level 1's 3rd dropdown is selected
  Level12(event: string) {
    if (event === '0' && this.fg.controls.level1.value === '0' && this.fg.controls.level11.value === '0') {
      this.isLevelenable = false;
      this.fg.controls.per.disable();
      this.fg.controls.level2.setValue('0');
      this.fg.controls.level3.setValue('0');
      this.PerClass = 'disableDiv';
      this.DisablePer = true;
      this.fg.controls.per.setValue(120);
      this.Text = 'Optional';
    } else {
      this.isLevelenable = true;
      }
  }

  // Function gets called after Level 2 dropdown is selected
  Level2(event: string) {
    if (event === '0') {
      this.fg.controls.per.disable();
      this.fg.controls.level3.setValue('0');
      this.fg.controls.per.setValue(120);
      this.DisablePer = true;
      this.PerClass = 'disableDiv';
      this.Text = 'Optional';
    } else {
      this.fg.controls.per.enable();
      this.DisablePer = false;
      this.PerClass = '';
      this.Text = '';
    }
  }

  // Function that takes the form data and calls the createEvent API
  PostData() {
    const positiveIntger = /^[0-9]{1,6}$/;
    this.errorEmail = false;
    this.notifArray = [];
    this.stop = false;
    this.userPush = [];
    if (this.emailCheck) {
      this.usersList.forEach((user: any) => {
        if ((this.fg.controls.level1.value !== '0' && user.unique_key === this.fg.controls.level1.value)) {
          if (!user.email || user.email === '') {
            // tslint:disable-next-line:max-line-length
            this.ngSnackbar.open( 'Email ID is not stored for ' + user.firstName + ' ' + user.lastName, 'OK', { duration: 2000, panelClass: 'alert-info' });
            this.stop = true;
          }
        }
        if ((this.fg.controls.level11.value !== '0' && user.unique_key === this.fg.controls.level11.value)) {
          if (!user.email || user.email === '') {
            // tslint:disable-next-line:max-line-length
            this.ngSnackbar.open('Email ID is not stored for ' + user.firstName + ' ' + user.lastName, 'OK', { duration: 2000, panelClass: 'alert-info' });
            this.stop = true;
          }
        }
        if ((this.fg.controls.level12.value !== '0' && user.unique_key === this.fg.controls.level12.value)) {
          if (!user.email || user.email === '') {
            // tslint:disable-next-line:max-line-length
            this.ngSnackbar.open('Email ID is not stored for ' + user.firstName + ' ' + user.lastName, 'OK', { duration: 2000, panelClass: 'alert-info' });
            this.stop = true;
          }
        }
        if ((this.fg.controls.level2.value !== '0' && user.unique_key === this.fg.controls.level2.value)) {
          if (!user.email || user.email === '') {
            // tslint:disable-next-line:max-line-length
            this.ngSnackbar.open('Email ID is not stored for ' + user.firstName + ' ' + user.lastName, 'OK', { duration: 2000, panelClass: 'alert-info' });
            this.stop = true;
          }
        }
        if ((this.fg.controls.level3.value !== '0' && user.unique_key === this.fg.controls.level3.value)) {
          if (!user.email || user.email === '') {
            // tslint:disable-next-line:max-line-length
            this.ngSnackbar.open('Email ID is not stored for ' + user.firstName + ' ' + user.lastName, 'OK', { duration: 2000, panelClass: 'alert-info' });
            this.stop = true;
          }
        }
        });
    }
    if ( ((this.fg.controls.level1.value === this.fg.controls.level11.value) && this.fg.controls.level11.value !== '0')
    || ((this.fg.controls.level11.value === this.fg.controls.level12.value) && this.fg.controls.level12.value !== '0')
    || ((this.fg.controls.level12.value === this.fg.controls.level1.value) && this.fg.controls.level1.value !== '0')
    ) {
      // tslint:disable-next-line:max-line-length
      this.ngSnackbar.open('Level 1 users should be unique', 'OK', { duration: 2000, panelClass: 'alert-info' });
      this.stop = true;
    }
    if (this.smsCheck) {
      this.notifArray.push(this.smsCheck);
    }
    if (this.emailCheck) {
      this.notifArray.push(this.emailCheck);
    }
    if (this.fg.controls.criteria.value === 'I-L') {
      this.thresholdDuration = this.fg.controls.th1.value;
    }
    if (this.fg.controls.criteria.value === 'D-L') {
      this.thresholdDuration = this.fg.controls.th2.value;
    }
    if (this.fg.controls.criteria.value === 'A-O') {
      this.thresholdDuration = this.fg.controls.th3.value;
    }
    if (this.fg.controls.criteria.value === 'U-L') {
      if (this.fg.controls.th4.value > 100) {
        this.ngSnackbar.open('Utilization should not be greater than 100%', 'OK', { duration: 2500, panelClass: 'alert-info' });
        this.stop = true;
      }
      this.thresholdDuration = this.fg.controls.th4.value;
    }

    if (this.fg.controls.criteria.value === 'D-D') {
      this.thresholdDuration = this.fg.controls.th5.value;
    }
    if (this.fg.controls.criteria.value === 'E-D') {
      this.thresholdDuration = this.fg.controls.th6.value;
    }
    if (this.fg.controls.criteria.value === 'U-LT') {
      if (this.fg.controls.th7.value > 100) {
        this.ngSnackbar.open('Utilization should not be greater than 100%', 'OK', { duration: 2500, panelClass: 'alert-info' });
        this.stop = true;
      }
      this.thresholdDuration = this.fg.controls.th7.value;
    }
    if ( this.thresholdDuration === '' || this.thresholdDuration === null) {
      this.ngSnackbar.open('Enter threshold value', 'OK', { duration: 2000, panelClass: 'alert-info' });
      this.stop = true;
    // tslint:disable-next-line:max-line-length
    } else if ( this.thresholdDuration <= 0 ) {
      this.ngSnackbar.open('Threshold value should be greater than 0', 'OK', { duration: 2000, panelClass: 'alert-info' });
      this.stop = true;
    // tslint:disable-next-line:max-line-length
    } else if (this.thresholdDuration > 0 && this.thresholdDuration <= 1440 && this.thresholdDuration != null && this.thresholdDuration.toString().match(positiveIntger)) {
      console.log('OK');
    } else if (this.thresholdDuration >= 1440) {
      this.ngSnackbar.open('Threshold value should be less than 1440', 'OK', { duration: 2000, panelClass: 'alert-info' });
      this.stop = true;
    } else {
      this.ngSnackbar.open('Threshold value should be an integral number', 'OK', { duration: 2000, panelClass: 'alert-info' });
      this.stop = true;
    }
    if (this.oLevel1 !== '0') {
      if (this.oLevel1 != null) {
        this.a1 = this.oLevel1[0].split(',');
        // this.user1 = this.a1[0];
        // this.name1 = this.a1[1];
        if (this.notifArray.length === 1 && this.notifArray[0] === 'E-mail') {
          console.log('level 1' , this.oLevel1);
        }
      }
    }

    if (this.fg.controls.level2.value !== '0') {
      if (!this.fg.controls.per.value) {
        this.ngSnackbar.open('Persistence Duration is mandatory for Level 2 users', 'OK',
        { duration: 2000, panelClass: 'alert-info' });
        this.stop = true;
      }
      if (!this.fg.controls.per.value.toString().match(positiveIntger)) {
        this.ngSnackbar.open('Persistence Duration should be an integral value', 'OK',
        { duration: 2000, panelClass: 'alert-info' });
        this.stop = true;
      }
      if (this.fg.controls.per.value <= 0 ) {
        this.ngSnackbar.open('Persistence Duration should be greater than 0', 'OK',
        { duration: 2000, panelClass: 'alert-info' });
        this.stop = true;
      }
      if (this.fg.controls.per.value > 1440 ) {
        this.ngSnackbar.open('Persistence Duration can not be greater than 1440', 'OK',
        { duration: 2000, panelClass: 'alert-info' });
        this.stop = true;
      }
    }
    if (!this.assetName) {
    this.ngSnackbar.open('Select Asset', 'OK',
        { duration: 2000, panelClass: 'alert-info' });
    this.stop = true;
  }
    this.userPush =  this.userPush.filter(this.onlyUnique);
  //   if (this.errorEmail === false) {
  //     console.log('Email Id is not configured for one or more of the above users');
  //  } else {

  // }
    if (this.stop === false) {
      const submit = {
        window: this.fg.controls.window.value,
        asset: this.assetName,
        type: this.type,
        threshold: this.thresholdDuration,
        criteria : this.fg.controls.window.value === 'currentDay' ? this.criteriaForCurrentDay : this.criteriaForLastSandTDays,
        notifications : {
            level1 : {
                userId : [this.fg.controls.level1.value, this.fg.controls.level11.value, this.fg.controls.level12.value],
            },
            level2 : {
              userId: [this.fg.controls.level2.value]
            },
            level3 : {
              userId: [this.fg.controls.level3.value]
            },
            mode : this.notifArray,
            per_dur : this.fg.controls.per.value
        },
    };
      this.onSpinner(true);
      this.alerts$.fs_createEvent(submit).subscribe(
        (data: any) => {
          this.createAlertResponse = data;
          if (this.createAlertResponse) {
            if (this.createAlertResponse.success) {
              this.ngSnackbar.open(this.createAlertResponse.message, 'OK', { duration: 2000, panelClass: 'snackbar-success' });
              this.onSpinner(false);
              this.router.navigate(['/home/alertsAndNotification/currentDefinedEvents']);
            }
          }
        },
        error => {
          console.log(error);
          this.ngSnackbar.open('Event definition could not be saved', 'OK', { duration: 2000, panelClass: 'alert-info' });
        });
   }
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  onEmit_TreeRadio(data) {
    console.log(data.value);
    this.assetName = data.value.value;
    this.type = data.value.type;
    this.isAssetEnable = true;
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.PostData();
    }
  }

  onSpinner(status: boolean) {
    setTimeout(() => {
      this.spinner.onRBSpinner$(status);
    }, 1500);
  }

}
