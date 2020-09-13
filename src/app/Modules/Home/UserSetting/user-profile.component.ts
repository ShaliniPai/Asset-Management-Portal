import { Component, OnInit } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { UserProfileService } from 'src/app/Core/Service/user-profile.service';
import { IFUserProfile } from 'src/app/Core/Interface/userProfile.interface';
import { RbSpinnerService } from 'src/app/Core/Service/rb-spinner.service';
import { IFUpdateUserProfile } from 'src/app/Core/Interface/updateUserProfile.interface';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import * as isdCodes from '../../../../assets/json/isdCodes.json';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  isEdit = false;
  countryCodes: string[] = [];
  userProfile: IFUserProfile;
  enterPhoneOtp = false;
  enterEmailOtp = false;
  emailOtpInput: string;
  phoneOtpInput: string;
  currentEmail: string;
  splicedPhoneNumber: string;
  countryCode: string;
  updateUserProfilePayload = {
    email: '', timezone: '', firstName: '', lastName: '', phone : '', countryCode: ''
  };
  userId = '';
  inputtimezone = '+05:30';
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  phonePattern = '([+]?\d{1,2}[.-\s]?)?(\d{3}[.-]?){2}\d{4}';
  timezones = [{ value: '-12:00', text: '(GMT -12:00) Eniwetok, Kwajalein' },
  { value: '-11:00', text: '(GMT -11:00) Midway Island, Samoa' },
  { value: '-10:00', text: '(GMT -10:00) Hawaii' },
  { value: '-09:30', text: '(GMT -9:30) Taiohae' },
  { value: '-09:00', text: '(GMT -9:00) Alaska' },
  { value: '-08:00', text: '(GMT -8:00) Pacific Time (US & Canada)' },
  { value: '-07:00', text: '(GMT -7:00) Mountain Time (US & Canada)' },
  { value: '-06:00', text: '(GMT -6:00) Central Time (US & Canada), Mexico City' },
  { value: '-05:00', text: '(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima' },
  { value: '-04:30', text: '(GMT -4:30) Caracas' },
  { value: '-04:00', text: '(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz' },
  { value: '-03:30', text: '(GMT -3:30) Newfoundland' },
  { value: '-03:00', text: '(GMT -3:00) Brazil, Buenos Aires, Georgetown' },
  { value: '-02:00', text: '(GMT -2:00) Mid-Atlantic' },
  { value: '-01:00', text: '(GMT -1:00) Azores, Cape Verde Islands' },
  { value: '+00:00', text: '(GMT) Western Europe Time, London, Lisbon, Casablanca' },
  { value: '+01:00', text: '(GMT +1:00) Brussels, Copenhagen, Madrid, Paris' },
  { value: '+02:00', text: '(GMT +2:00) Kaliningrad, South Africa' },
  { value: '+03:00', text: '(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg' },
  { value: '+03:30', text: '(GMT +3:30) Tehran' },
  { value: '+04:00', text: '(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi' },
  { value: '+04:30', text: '(GMT +4:30) Kabul' },
  { value: '+05:00', text: '(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent' },
  { value: '+05:30', text: '(GMT +5:30) Bombay, Calcutta, Madras, New Delhi' },
  { value: '+05:45', text: '(GMT +5:45) Kathmandu, Pokhara' },
  { value: '+06:00', text: '(GMT +6:00) Almaty, Dhaka, Colombo' },
  { value: '+06:30', text: '(GMT +6:30) Yangon, Mandalay' },
  { value: '+07:00', text: '(GMT +7:00) Bangkok, Hanoi, Jakarta' },
  { value: '+08:00', text: '(GMT +8:00) Beijing, Perth, Singapore, Hong Kong' },
  { value: '+08:45', text: '(GMT +8:45) Eucla' },
  { value: '+09:00', text: '(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk' },
  { value: '+09:30', text: '(GMT +9:30) Adelaide, Darwin' },
  { value: '+10:00', text: '(GMT +10:00) Eastern Australia, Guam, Vladivostok' },
  { value: '+10:30', text: '(GMT +10:30) Lord Howe Island' },
  { value: '+11:00', text: '(GMT +11:00) Magadan, Solomon Islands, New Caledonia' },
  { value: '+11:30', text: '(GMT +11:30) Norfolk Island' },
  { value: '+12:00', text: '(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka' },
  { value: '+12:45', text: '(GMT +12:45) Chatham Islands' },
  { value: '+13:00', text: '(GMT +13:00) Apia, Nukualofa' },
  { value: '+14:00', text: '(GMT +14:00) Line Islands, Tokelau' }];
  userdetails = { userTimeZone: '+05:30', email: '', firstName: '', lastName: '', tenantId: '', userId: '', phone: '' };

  constructor( private router: Router, private userProfileService: UserProfileService, private ngSpinnerService: RbSpinnerService,
               private ngSnackBar: MatSnackBar) { }

  ngOnInit() {
    for ( const isdCode of isdCodes) {
      if (isdCode.calling_code) {
        this.countryCodes.push(isdCode.calling_code);
      }
    }
    this.enterEmailOtp = false;
    this.enterPhoneOtp = false;
    this.emailOtpInput = '';
    this.phoneOtpInput = '';
    this.ngSpinnerService.onRBSpinner$(true);
    this.getUserProfile();
  }

  getUserProfile() {
    this.userProfileService.getUserProfile().subscribe( (res: IFUserProfile) => {
      this.userProfile = res;
      this.currentEmail = res.email;
      this.countryCode = this.userProfile.countryCode;
      this.splicedPhoneNumber = this.userProfile.phone.slice(this.userProfile.countryCode.length, this.userProfile.phone.length);
      this.ngSpinnerService.onRBSpinner$(false);
    },
    (err) => {
      console.log(err);
      this.ngSpinnerService.onRBSpinner$(false);
    });
  }

  updateUserProfile() {
    // this.ngSpinnerService.onRBSpinner$(true);
    console.log(this.userProfile.timezone);
    this.updateUserProfilePayload.email = this.userProfile.email;
    this.updateUserProfilePayload.phone = this.userProfile.countryCode + this.splicedPhoneNumber;
    this.updateUserProfilePayload.firstName = this.userProfile.firstName;
    this.updateUserProfilePayload.lastName = this.userProfile.lastName;
    this.updateUserProfilePayload.timezone = this.userProfile.timezone;
    this.updateUserProfilePayload.countryCode = this.userProfile.countryCode;
    this.userProfileService.updateUserProfile(this.updateUserProfilePayload).subscribe( (res: any) => {
      if ( res.success === true ) {
        this.ngSnackBar.open(res.message, 'OK', { duration: 2000, panelClass: 'snackbar-success'});
        this.ngOnInit();
      } else {
        this.ngSnackBar.open(res.message, 'OK', { duration: 2000, panelClass: 'alert-info'});
        this.ngSpinnerService.onRBSpinner$(false);

      }
    },
    (err) => {
    this.ngSpinnerService.onRBSpinner$(false);
    console.log(err);
    });
  }

  showPhoneOtp() {
    this.enterPhoneOtp = true;
  }

  showEmailOtp() {
    this.enterEmailOtp = true;
  }

  undoEmailVerify() {
    this.enterEmailOtp = false;
  }

  undoPhoneVerify() {
    this.enterPhoneOtp = false;
  }

  verifyEmail(emailOtp: string) {
    this.userProfileService.verifyEmail(emailOtp).subscribe( (res: any) => {
      this.ngSnackBar.open(res.message, 'OK', { duration: 2000, panelClass: 'snackbar-success'});
      this.ngOnInit();
    }, (err) => {
      this.ngSnackBar.open(err.message, 'OK', { duration: 2000, panelClass: 'alert-info'});
    });
  }

  verifyPhone(phoneOtp: string) {
    if (!!!phoneOtp) {
      this.ngSnackBar.open('Please Enter OTP', 'OK', { duration: 2000, panelClass: 'alert-info' });
      return;
    }
    this.userProfileService.verifyPhone(phoneOtp).subscribe( (res: any) => {
      this.ngSnackBar.open(res.message, 'OK', { duration: 2000, panelClass: 'snackbar-success'});
      this.ngOnInit();
    }, (err) => {
      this.ngSnackBar.open(err.message, 'OK', { duration: 2000, panelClass: 'alert-info'});
    });
  }

}
