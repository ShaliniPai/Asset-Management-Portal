import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { MapComponent } from '../../../map/map.component';
import { TimezoneService } from 'src/app/Core/Service/timezone.service';
import { SitesService } from 'src/app/Core/Service/sites.service';
import { RbSpinnerService } from 'src/app/Core/Service/rb-spinner.service';
import { SnackbarNotificationService } from 'src/app/Core/MatSnackBarCom/snackbar-notification.service';
import { ClassSites } from 'src/app/Core/Class/class.sites';
import { element } from 'protractor';


@Component({
  selector: 'app-sites-manage',
  templateUrl: './sites-manage.component.html',
  styleUrls: ['./sites-manage.component.scss'],
})
export class SitesManageComponent implements OnInit {

  @ViewChild('formSumit', { static: false }) formTemplate;
  @Input() InputSiteRow: ClassSites;
  FBSite: FormGroup;
  weekCategory: 'weekdays';
  isEnableAddZone: boolean;
  zones: { _id: string, zname: string, zid: string }[];
  timeZones: { text: string, value: string }[];
  cusZone;
  pageType;
  saveType = 'add';
  dayNumnbers = [{ no: 1, name: 'Monday' }, { no: 2, name: 'Tuesday' },
  { no: 3, name: 'Wednesday' }, { no: 4, name: 'Thursday' }, { no: 5, name: 'Friday' },
  { no: 6, name: 'Saturday' }, { no: 7, name: 'Sunday' }];
  defaultWeekDays = [1, 2, 3, 4, 5];
  defaultWeekend = [6, 7];
  constructor(
    private fb: FormBuilder,
    private matDialog: MatDialog,
    private serviceTimezone: TimezoneService,
    private self: SitesService,
    private spinner: RbSpinnerService,
    private snackbar: SnackbarNotificationService
  ) { }

  ngOnInit() {
    this.OnFormConfig();
    this.OnAPISLoad();

    this.OnViewCatogery();
    /// Get List of timezones
  }

  /**
   * Load FormFields when View Initialized
   */
  OnViewCatogery() {
    if (this.InputSiteRow && this.InputSiteRow._id) {
      this.pageType = 'view';
      const siteIns = new ClassSites(this.InputSiteRow);
      siteIns['weekCatogery'] = 'weekdays';
      siteIns['cusZone'] = '';
      this.FBSite.setValue(siteIns);
    } else {
      this.pageType = 'save';
    }
  }

  /**
   * Forrm Initial Configuration
   */
  OnFormConfig() {
    this.FBSite = this.fb.group({
      _id: [''],
      siteName: ['', [Validators.required]],
      des: [''],
      loc: this.fb.group({
        latitude: ['', [Validators.required]],
        longitude: ['', [Validators.required]]
      }),
      timezone: ['+05:30', [Validators.required]],
      zone: ['', [Validators.required]],
      zid: [''],
      cusZone: [''],
      wifiSSID: ['', [Validators.required]],
      wifiPassword: ['', [Validators.required]],
      weekCatogery: ['weekdays'],
      opHours: this.fb.group({
        weekdays: this.fb.group({
          days: [this.defaultWeekDays],
          time: this.fb.group({
            from: this.fb.group({
              hh: [12],
              mm: [0],
              meridiem: ['AM']
            }),
            to: this.fb.group({
              hh: [12],
              mm: [0],
              meridiem: ['AM']
            })
          })
        }),
        weekend: this.fb.group({
          days: [this.defaultWeekend],
          time: this.fb.group({
            from: this.fb.group({
              hh: [12],
              mm: [0],
              meridiem: ['AM']
            }),
            to: this.fb.group({
              hh: [12],
              mm: [0],
              meridiem: ['AM']
            })
          })
        })
      })
    });
  }

  /**
   * Initital default API's load
   */
  OnAPISLoad() {
    this.onSpinner(true);
    /// Load Zones
    this.self.getZone().subscribe((res: any[]) => {
      this.zones = res;
      this.serviceTimezone.getTimezones().subscribe((tz: any) => {
        this.timeZones = tz;
        this.onSpinner(false);
      });
    }, error => {
      this.onSpinner(false);
    });
  }


  /**
   * Save/Updat the formData
   * @param formData Form data that hold the form builder
   * @param saveType This key will helps to call defferent API by using single function ('add','udpate') with same form data
   */
  onSubmit(formData: FormGroup, saveType: string) {
    console.log('in sites');
    if (formData.valid) {
      const zid = this.zones.find(ele => ele._id === this.FBSite.get('zone').value);
      this.FBSite.controls.zid.setValue(zid.zid);
      console.log('this is zid '+ zid.zid);
      const tempData = formData.value;
      /// Check Min one day selected in weekday/weekend
      const weekDays = (formData.get('opHours').get('weekdays').value).days;
      const weekend = (formData.get('opHours').get('weekend').value).days;
      if ((weekDays && weekDays[0]) || (weekend && weekend[0])) {
        const isDaysOVerlapping = this.onDaysOverLapping(weekDays, weekend);
        if (!isDaysOVerlapping) {
          this.onSpinner(true);
          this.self.saveSite(formData.value, saveType).subscribe((res: any) => {
            this.snackbar.onOpenSnack('success', res.message);
            if (this.InputSiteRow) {
              const id = this.InputSiteRow._id;
              this.InputSiteRow = tempData;
              this.InputSiteRow._id = id;
              const tz = this.zones.find(ele => ele._id === this.FBSite.get('zone').value);
              this.InputSiteRow.zone = tz.zname;
            }
            this.onResetForm();
            this.onSpinner(false);
          }, err => {
            console.log(err);
            this.snackbar.onOpenSnack('error', err.error.message);
            this.onSpinner(false);
          });
        } else {
          this.snackbar.onOpenSnack('error', 'Weekdays and Weekend days are overlapping');
        }
      } else {
        this.snackbar.onOpenSnack('error', 'Select the operating days. Minimum one day required from Weekdays/Weekend');
      }
    } else {
      this.snackbar.onOpenSnack('error', 'Entered Site data is invalid (Missing/Invalid fields data)');
    }
  }

  /**
   * Reset the Form by using Template reference
   */
  onResetForm() {
    /// Revert basck to view if Updation is completed
    if (this.saveType === 'update') {
      this.pageType = 'view';
      if (this.zones) {
        const tz = this.zones.find(ele => ele._id === this.FBSite.get('zone').value);
        this.FBSite.get('zone').patchValue(tz.zname);
      }
    } else {
      this.formTemplate.resetForm();
      this.FBSite.get('opHours')
        .patchValue({
          weekdays: {
            days: this.defaultWeekDays,
            time: { from: { hh: 12, mm: 0, meridiem: 'AM' }, to: { hh: 12, mm: 0, meridiem: 'AM' } }
          }
        });
      this.FBSite.get('opHours')
        .patchValue({
          weekend: {
            days: this.defaultWeekend,
            time: { from: { hh: 12, mm: 0, meridiem: 'AM' }, to: { hh: 12, mm: 0, meridiem: 'AM' } }
          }
        });
    }
    this.FBSite.patchValue({ weekCatogery: 'weekdays' });
  }

  openDialog() {
    const dialogRef = this.matDialog.open(MapComponent, { width: '80%', height: '550px' });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Result Dialogbox : ' + JSON.stringify(result));
      this.FBSite.get('loc').setValue({ latitude: result.latitude, longitude: result.longitude });
      // this.FBSite.patchValue({ name: result.latitude });
    });
  }


  /**------------------------------------------------
   * Add Zone Information
   */
  /// Enable Zone for add
  onEnableZone() {
    this.isEnableAddZone = true;
  }

  /// Add Time by calling API
  onAddZone(zoneName: string) {
    this.onSpinner(true);
    this.self.addZone(zoneName).subscribe((res: any) => {
      this.snackbar.onOpenSnack('success', res.message);
      /// load Zone list
      this.self.getZone().subscribe((list: any[]) => {
        this.zones = list;
        this.onSpinner(false);
        const id = this.zones.find(ele => ele.zname === zoneName);
        this.FBSite.get('zone').patchValue(id._id);
      }, (error) => {
        this.onSpinner(false);
        console.log(error);
      });
      this.onResetAddZone();
    }, err => {
      console.log(err);
      this.snackbar.onOpenSnack('error', err.error.message);
      this.onSpinner(false);
    });
  }

  /// Resutl timezone field
  onResetAddZone() {
    this.isEnableAddZone = false;
    this.cusZone = null;
  }
  /// .. End Zone information
  /**
   *
   * @param daysType This field represent either weekdays or weekends
   * @param timeCol This filed reresent time either FROM or TO
   */
  onMinutesOverFlow(daysType, timeCol) {
    const minutes = this.FBSite.get('opHours').value[daysType].time[timeCol].mm;
    if (+ minutes === 60) {
      this.FBSite.get('opHours').get(daysType).get('time').get(timeCol).patchValue({ mm: 0 });
    }
  }

  onSpinner(bool: boolean) {
    setTimeout(() => {
      this.spinner.onRBSpinner$(bool);
    });
  }


  onViewTime(timeArray) {
    return `${timeArray.hh}:${timeArray.mm}:${timeArray.meridiem}`;
  }


  /**--------------------------------------------------
   * Edit Configurations
   */
  /// On Click of Edit button
  onClickEdit() {
    this.onSpinner(true);
    this.pageType = 'save';
    this.saveType = 'update';
    this.self.getZone().subscribe((list: any[]) => {
      const id = list.find(ele => ele.zname === this.InputSiteRow.zone);
      // this.InputSiteRow.zone = id._id;
      this.FBSite.get('zone').patchValue(id._id);
      // this.InputSiteRow['weekCatogery'] = 'weekdays';
      //  this.FBSite.setValue(this.InputSiteRow);
      this.onSpinner(false);
    }, (error) => {
      this.onSpinner(false);
      console.log(error);
    });
  }

  onPageTitle() {
    if (this.pageType === 'view') {
      return 'View Site';
    } else {
      if (this.saveType === 'update') {
        return 'Edit Site';
      }
      return 'Add New Site';
    }
  }

  onGetTimezonelabel(code) {
    const tz = this.timeZones.find(ele => ele.value === code);
    return tz.text;
  }

  /**
   * This fuction will returns boolean value if weekday & weekend days are overlapped then true else false
   * @param weekdays  Week day numbers [1-7]
   * @param weekend weekend numbers [1-7]
   */
  onDaysOverLapping(weekdays: number[], weekend: number[]) {
    if (weekdays && weekdays.length && weekend && weekend.length) {
      for (let index = 0; index < weekdays.length; index++) {
        const day = weekdays[index];
        const isDuplicateDay = weekend.findIndex(ele => ele === day);
        if (isDuplicateDay >= 0) {
          return true;
        }
      }
      return false;
    }
    return false;
  }
}
