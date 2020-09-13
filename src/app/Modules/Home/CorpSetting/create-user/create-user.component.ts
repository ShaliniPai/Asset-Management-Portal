import { Component, OnInit } from '@angular/core';
import { IFTreeConfigDataModel } from '../../treeView/interface.treehierarchy';
import { TreeHierarchyService } from '../../treeView/tree-hierarchy.service';
import * as  data from 'src/assets/json/isdCodes.json';
import { Validators, FormGroup, FormControl, NgForm } from '@angular/forms';
import { AddUserService } from 'src/app/Core/Service/add-user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RbSpinnerService } from 'src/app/Core/Service/rb-spinner.service';
import { MatSnackBar } from '@angular/material';



@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  constructor(
    private router: Router,
    private http: HttpClient,
    private addUserService: AddUserService,
    private spinner: RbSpinnerService,
    private ngSnackbar: MatSnackBar
  ) { }

  _ModuleType;
  public data1 = data;
  treeViewConfig: IFTreeConfigDataModel = {
    url: `/assets/json/mock.assets.json`,
    dataModel: [
      { valCol: 'tenantId', textCol: 'tenantName', isNotColumns: true },
      { valCol: 'zone', textCol: 'zone', isNotColumns: false },
      { valCol: 'group', textCol: 'group', isNotColumns: false },
      { valCol: 'location', textCol: 'location', isNotColumns: false },
      { valCol: 'assetName', textCol: 'assetName', isNotColumns: false }
    ]
  };

  breakCode = 1;
  userLevel: string;
  userEntity: string;

  /***********Form Group***************/
  profileForm = new FormGroup({
    /********third user data***********/
    u3_lastName: new FormControl(''),
    u3_firstName: new FormControl(''),
    u3_userType: new FormControl(''),
    u3_userId: new FormControl(''),
    u3_email: new FormControl(''),
    u3_isdCode: new FormControl(''),
    u3_phone: new FormControl(''),
    /********third user data***********/

    /********second user data***********/
    u2_lastName: new FormControl(''),
    u2_firstName: new FormControl(''),
    u2_userType: new FormControl(''),
    u2_userId: new FormControl(''),
    u2_email: new FormControl(''),
    u2_isdCode: new FormControl(''),
    u2_phone: new FormControl(''),
    /********second user data***********/

    /********first user data***********/
    u1_lastName: new FormControl(''),
    u1_firstName: new FormControl(''),
    u1_userType: new FormControl(''),
    u1_userId: new FormControl(''),
    u1_email: new FormControl(''),
    u1_isdCode: new FormControl(''),
    u1_phone: new FormControl(''),
    /********first user data***********/
  });


  onSubmit() {
    this.onSpinner(true);
    // TODO: Use EventEmitter with form value
    const user = new Array();
    console.warn(this.profileForm.value);
    console.warn(this.profileForm.value.u1_isdCode);

    let i;
    const count = 0;

    for (i = 0; i < 3; i++) {
      if (i === 0) {
        if (this.profileForm.value.u1_firstName === ''
        || this.profileForm.value.u1_lastName === ''
        || this.profileForm.value.u1_userId === ''
        || this.profileForm.value.u1_isdCode === ''
        || this.profileForm.value.u1_phone === ''
        || this.profileForm.value.u1_userType === '') {
          console.log('in empty');
          this.ngSnackbar.open('User Cannot be added. Fill required fields ', 'OK', { duration: 2000, panelClass: 'alert-info' });

          if ((this.profileForm.value.u1_lastName === '')) {
            this.ngSnackbar.open('User Cannot be added. Last name cannot be empty ', 'OK', { duration: 2000, panelClass: 'alert-info' });
          } else if ((this.profileForm.value.u1_firstName === '')) {
            this.ngSnackbar.open('User Cannot be added. First name cannot be empty ', 'OK', { duration: 2000, panelClass: 'alert-info' });
          } else if ((this.profileForm.value.u1_userType === '')) {
            this.ngSnackbar.open('User Cannot be added. User Type code cannot be empty ',
            'OK', { duration: 2000, panelClass: 'alert-info' });
          } else if ((this.profileForm.value.u1_userId === '')) {
            this.ngSnackbar.open('User Cannot be added. User Id cannot be empty ', 'OK', { duration: 2000, panelClass: 'alert-info' });
          } else if ((this.profileForm.value.u1_isdCode === '')) {
            this.ngSnackbar.open('User Cannot be added. Country code cannot be empty ', 'OK', { duration: 2000, panelClass: 'alert-info' });
          } else if ((this.profileForm.value.u1_phone === '')) {
            this.ngSnackbar.open('User Cannot be added. Phone No. cannot be empty ', 'OK', { duration: 2000, panelClass: 'alert-info' });
          }
          this.breakCode = 0;
          this.onSpinner(false);
          break;
        }
        /* istanbul ignore next  */
        if (this.breakCode === 1) {
          if (this.profileForm.value.u1_phone === undefined || this.profileForm.value.u1_isdCode === undefined) {
            this.breakCode = 0;
            this.ngSnackbar.open('Select country code and fill phone No. ', 'OK', { duration: 3000, panelClass: 'salert-info' });
          } else {
            console.log('in the else part');

            var phonee = this.profileForm.value.u1_phone;
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
              console.log('matching without44 India');
              if (phonee.toString().match('^[0-9]*$')) {
                console.log('matching without India');
              } else {
                this.breakCode = 0;
                this.ngSnackbar.open('Phone No. should contain only digits ', 'OK', { duration: 3500, panelClass: 'salert-info' });
              }
            }
          }
        }
        user[i] = {
          firstName: this.profileForm.value.u1_firstName,
          lastName: this.profileForm.value.u1_lastName,
          unique_key: (this.profileForm.value.u1_userId).toLowerCase(),
          email: (this.profileForm.value.u1_email).toLowerCase(),
          countryCode: this.profileForm.value.u1_isdCode,
          phone: '+' + this.profileForm.value.u1_isdCode + this.profileForm.value.u1_phone,
          userRole: this.profileForm.value.u1_userType
        };
      } /* istanbul ignore next */else {
        if (i === 1 && this.profileForm.value.u2_lastName !== '') {
          if (this.profileForm.value.u2_firstName == "" || this.profileForm.value.u2_lastName == "" || this.profileForm.value.u2_userId == "" || this.profileForm.value.u2_isdCode == "" || this.profileForm.value.u2_phone == "" || this.profileForm.value.u2_userType == "") {
            this.ngSnackbar.open('User Cannot be added. Fill required fields ', 'OK', { duration: 2000, panelClass: 'alert-info' });

            if ((this.profileForm.value.u2_lastName === '')) {
              this.ngSnackbar.open('User Cannot be added. Last name cannot be empty ', 'OK', { duration: 2000, panelClass: 'alert-info' });
            } else if ((this.profileForm.value.u2_firstName === '')) {
              this.ngSnackbar.open('User Cannot be added. First name cannot be empty ', 'OK', { duration: 2000, panelClass: 'alert-info' });
            } else if ((this.profileForm.value.u2_userType === '')) {
              this.ngSnackbar.open('User Cannot be added. User Type code cannot be empty ', 'OK', { duration: 2000, panelClass: 'alert-info' });
            } else if ((this.profileForm.value.u2_userId === '')) {
              this.ngSnackbar.open('User Cannot be added. User Id cannot be empty ', 'OK', { duration: 2000, panelClass: 'alert-info' });
            } else if ((this.profileForm.value.u2_isdCode === '')) {
              this.ngSnackbar.open('User Cannot be added. Country code cannot be empty ', 'OK', { duration: 2000, panelClass: 'alert-info' });
            } else if ((this.profileForm.value.u2_phone === '')) {
              this.ngSnackbar.open('User Cannot be added. Phone No. cannot be empty ', 'OK', { duration: 2000, panelClass: 'alert-info' });
            }

            this.breakCode = 0;
            this.onSpinner(false);
            break;
          }
          /* istanbul ignore next */
          if (this.breakCode == 1) {
            if (this.profileForm.value.u2_phone == undefined || this.profileForm.value.u2_isdCode == undefined) {
              this.breakCode = 0;
              this.ngSnackbar.open('Select country code and fill phone No. ', 'OK', { duration: 3000, panelClass: 'salert-info' });
            } else {

              var phonee = this.profileForm.value.u2_phone;
              phonee.toString().match('^[0-9]{10}$');
              if (this.profileForm.value.u2_isdCode == '91') {
                if (phonee.toString().match('^[0-9]{10}$')) {
                  console.log('matching in india');
                } else {
                  console.log('unmatching in india');
                  this.breakCode = 0;
                  this.ngSnackbar.open('Phone No. should contain only 10 digits ', 'OK', { duration: 3500, panelClass: 'salert-info' });
                }
              } else if (this.profileForm.value.u2_isdCode != '91') {
                console.log('matching without44 India');
                if (phonee.toString().match('^[0-9]*$')) {
                  console.log('matching without India');
                } else {
                  this.breakCode = 0;
                  this.ngSnackbar.open('Phone No. should contain only digits ', 'OK', { duration: 3500, panelClass: 'salert-info' });
                }
              }
            }
          }

          user[i] = {
            firstName: this.profileForm.value.u2_firstName,
            lastName: this.profileForm.value.u2_lastName,
            unique_key: (this.profileForm.value.u2_userId).toLowerCase(),
            email: (this.profileForm.value.u2_email).toLowerCase(),
            countryCode: this.profileForm.value.u2_isdCode,
            phone: '+' + this.profileForm.value.u2_isdCode + this.profileForm.value.u2_phone,
            userRole: this.profileForm.value.u2_userType
          }
        } else if (i === 2 && this.profileForm.value.u3_lastName !== '') {
          if (this.profileForm.value.u3_firstName === "" || this.profileForm.value.u3_lastName == "" || this.profileForm.value.u3_userId == "" || this.profileForm.value.u3_isdCode == "" || this.profileForm.value.u3_phone == "" || this.profileForm.value.u3_userType == "") {
            this.ngSnackbar.open('User Cannot be added. Fill required fields. ', 'OK', { duration: 2000, panelClass: 'alert-info' });

            if ((this.profileForm.value.u3_lastName === '')) {
              this.ngSnackbar.open('User Cannot be added. Last name cannot be empty ', 'OK', { duration: 2000, panelClass: 'alert-info' });
            } else if ((this.profileForm.value.u3_firstName === '')) {
              this.ngSnackbar.open('User Cannot be added. First name cannot be empty ', 'OK', { duration: 2000, panelClass: 'alert-info' });
            } else if ((this.profileForm.value.u3_userType === '')) {
              this.ngSnackbar.open('User Cannot be added. User Type code cannot be empty ', 'OK', { duration: 2000, panelClass: 'alert-info' });
            } else if ((this.profileForm.value.u3_userId === '')) {
              this.ngSnackbar.open('User Cannot be added. User Id cannot be empty ', 'OK', { duration: 2000, panelClass: 'alert-info' });
            } else if ((this.profileForm.value.u3_isdCode === '')) {
              this.ngSnackbar.open('User Cannot be added. Country code cannot be empty ', 'OK', { duration: 2000, panelClass: 'alert-info' });
            } else if ((this.profileForm.value.u3_phone === '')) {
              this.ngSnackbar.open('User Cannot be added. Phone No. cannot be empty ', 'OK', { duration: 2000, panelClass: 'alert-info' });
            }

            this.breakCode = 0;
            this.onSpinner(false);
            break;
          }
          /* istanbul ignore next */
          if (this.breakCode === 1) {
            if (this.profileForm.value.u3_phone === undefined || this.profileForm.value.u3_isdCode === undefined) {
              this.breakCode = 0;
              this.ngSnackbar.open('Select country code and fill phone No. ', 'OK', { duration: 3000, panelClass: 'salert-info' });
            } else {
              var phonee = this.profileForm.value.u3_phone;
              phonee.toString().match('^[0-9]{10}$');
              if (this.profileForm.value.u3_isdCode == '91') {
                if (phonee.toString().match('^[0-9]{10}$')) {
                  console.log('matching in india');
                } else {
                  console.log('unmatching in india');
                  this.breakCode = 0;
                  this.ngSnackbar.open('Phone No. should contain only 10 digits ', 'OK', { duration: 3500, panelClass: 'salert-info' });
                }
              } /* istanbul ignore next */else if (this.profileForm.value.u3_isdCode != '91') {
                console.log('matching without44 India');
                if (phonee.toString().match('^[0-9]*$')) {
                  console.log('matching without India');
                } /* istanbul ignore next */else {
                  this.breakCode = 0;
                  this.ngSnackbar.open('Phone No. should contain only digits ', 'OK', { duration: 3500, panelClass: 'salert-info' });
                }
              }
            }
          }
          user[i] = {
            firstName: this.profileForm.value.u3_firstName,
            lastName: this.profileForm.value.u3_lastName,
            unique_key: (this.profileForm.value.u3_userId).toLowerCase(),
            email: (this.profileForm.value.u3_email).toLowerCase(),
            countryCode: this.profileForm.value.u3_isdCode,
            phone: '+' + this.profileForm.value.u3_isdCode + this.profileForm.value.u3_phone,
            userRole: this.profileForm.value.u3_userType
          };
        }
      }
    }

    if (this.breakCode === 1) {
      this.addUserService.addUser((user)).subscribe((res: any) => {
        this.onSpinner(false);
        this.ngSnackbar.open(res.message, 'OK', { duration: 2000, panelClass: 'snackbar-success' });
        /* istanbul ignore next */
        window.location.reload();
      }, err => {
        console.log('err2 - ' + err.error.message);
        this.onSpinner(false);
        this.ngSnackbar.open(err.error.message, 'OK', { duration: 3200, panelClass: 'alert-info' });
      });
    } else {
      this.onSpinner(false);
    }

    this.breakCode = 1;
    console.log(user);
  }

  public isdCodes: any = data;



  ngOnInit() {
    this.userLevel = localStorage.getItem('upUserLevel');
    this.userEntity = localStorage.getItem('upUserEntity');
    // this.router.navigate(['/home/corp/user/createUser']);
  }

  onSpinner(bool: boolean) {
    setTimeout(() => {
      this.spinner.onRBSpinner$(bool);
    });
  }

}
