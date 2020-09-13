import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, NgForm, Validators, FormBuilder } from '@angular/forms';
import { GetUserService } from 'src/app/Core/Service/get-user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CorpSettingUserService } from 'src/app/Core/Service/corp-setting-user.service';
import * as data from 'src/assets/json/isdCodes.json';
import { RbSpinnerService } from 'src/app/Core/Service/rb-spinner.service';
import { MatSnackBar } from '@angular/material';
import { AuthorizationService } from 'src/app/Core/Service/authorization.service';


@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  firstName: string;
  lastName: string;
  updatedUser: any;
  unique_key: string;
  email: string;
  phone: string;
  userRole: string;
  users: any[];
  SearchTerm;
  lname: string;
  DeleteId: any;
  editIndex = 0;
  editRow = false;
  delrow = false;
  ConfirmDeletion: any;
  userLevel: string;
  userEntity: string;
  displayedColumns: string[] = ['sno', 'lastName', 'firstName', 'usertype', 'userId', 'emailId', 'phone', 'delete', 'edit'];
  dataSource = this.users;
  countryCode: string;
  onlyPhoneNo: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private getUserService: GetUserService,
    private ngSnackbar: MatSnackBar,
    private corpSettingUserService: CorpSettingUserService,
    private spinner: RbSpinnerService,
    public $auth: AuthorizationService
  ) { }

  public isdCodes: any = data;

  breakCode = 1;

  profileForm = new FormGroup({
    /********update user data***********/
    u1_lastName: new FormControl(''),
    u1_firstName: new FormControl(''),
    u1_userType: new FormControl(''),
    u1_userId: new FormControl(''),
    u1_email: new FormControl(''),
    u1_isdCode: new FormControl(''),
    u1_phone: new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern('^[0-9]*$')
    ]))
    /********update user data***********/
  });

  ngOnInit() {
    this.getUserData();
    this.userLevel = localStorage.getItem('upUserLevel');
    this.userEntity = localStorage.getItem('upUserEntity');
  }

  getUserData() {
    this.onSpinner(true);
    this.getUserService.getUser().subscribe((res: any) => {
      this.users = res;
      this.onSpinner(false);
    }, err => {
      this.onSpinner(false);
      console.log(err);
    });
  }

  Delete(id) {
    this.DeleteId = { id };
    this.ConfirmDeletion = true;
  }

  ConfirmDelete() {
    this.onSpinner(true);
    this.corpSettingUserService.deleteUser(this.DeleteId).subscribe((res: any) => {
      this.getUserData();
      this.ngSnackbar.open('User Deleted Successfully ', 'OK', { duration: 2000, panelClass: 'snackbar-success' });

    }, err => {
      this.onSpinner(false);
      console.log('err2 - ' + JSON.stringify(err));
      this.ngSnackbar.open('User cannot be deleted ' + err.error.message, 'OK', { duration: 2000, panelClass: 'salert-info' });
    });
    this.ConfirmDeletion = false;
  }


  Cancel() {
    this.ConfirmDeletion = false;
  }


  onEdit(index, row) {
    this.editRow = true;
    this.editIndex = index;
    row.countryCode = (row.countryCode).replace('+', '');
    row.phone = (row.phone).replace('+' + row.countryCode, '');
  }

  onUndo(index, row) {
    this.editIndex = 0;
    this.editRow = false;
    this.getUserData();
  }

  onUpdate(row, i) {
    if (this.profileForm.value.u1_lastName === undefined || this.profileForm.value.u1_lastName === '') {
      this.breakCode = 0;
      this.ngSnackbar.open('Fill last name. ', 'OK', { duration: 3000, panelClass: 'salert-info' });
    }
    if (this.profileForm.value.u1_firstName === undefined || this.profileForm.value.u1_firstName === '') {
      this.breakCode = 0;
      this.ngSnackbar.open('Fill first name. ', 'OK', { duration: 3000, panelClass: 'salert-info' });
    }

    if (this.profileForm.value.u1_phone === undefined || this.profileForm.value.u1_isdCode === undefined) {
      this.breakCode = 0;
      console.log('here3');
      this.ngSnackbar.open('Select country code and fill phone No. ', 'OK', { duration: 3000, panelClass: 'salert-info' });
    } else {
      const phonee = this.profileForm.value.u1_phone;
      phonee.toString().match('^[0-9]{10}$');
      if (this.profileForm.value.u1_isdCode === '91') {
        if (phonee.toString().match('^[0-9]{10}$')) {
          console.log('matching in india');
        } else {
          console.log('unmatching in india');
          this.breakCode = 0;
          this.ngSnackbar.open('Phone No. should contain only 10 digits ', 'OK', { duration: 3500, panelClass: 'salert-info' });
        }
      } else if (this.profileForm.value.u1_isdCode !== '91') {
        console.log('matching without44 India...' + this.profileForm.value.u1_isdCode);
        if (phonee.toString().match('^[0-9]*$')) {
          console.log('matching without India');
        } else {
          this.breakCode = 0;
          this.ngSnackbar.open('Phone No. should contain only digits ', 'OK', { duration: 3500, panelClass: 'salert-info' });
        }
      }
      this.phone = '+' + this.profileForm.value.u1_isdCode + this.profileForm.value.u1_phone;
    }
    this.unique_key = row.unique_key;
    this.updatedUser = {
      firstName: this.profileForm.value.u1_firstName,
      lastName: this.profileForm.value.u1_lastName,
      unique_key: (this.unique_key).toLowerCase(),
      email: (this.profileForm.value.u1_email).toLowerCase(),
      countryCode: this.profileForm.value.u1_isdCode,
      phone: '+' + this.profileForm.value.u1_isdCode + this.profileForm.value.u1_phone,
      userRole: this.profileForm.value.u1_userType
    };

    if (this.breakCode === 1) {
      this.corpSettingUserService.updateUser(this.updatedUser).subscribe((res: any) => {
        this.getUserData();
        this.ngSnackbar.open('User updated ', 'OK', { duration: 2000, panelClass: 'snackbar-success' });
      }, err => {
        this.onSpinner(false);
        console.log('err2 - ' + JSON.stringify(err.error.message));
        this.ngSnackbar.open(err.error.message, 'OK', { duration: 3000, panelClass: 'salert-info' });
      });
      this.editIndex = 0;
      this.editRow = false;
      this.breakCode = 1;
      this.getUserData();
    } else if (this.breakCode === 0) {
      this.breakCode = 1;
      // this.getUserData();
    }
  }

  onSpinner(bool: boolean) {
    setTimeout(() => {
      this.spinner.onRBSpinner$(bool);
    });
  }

}
