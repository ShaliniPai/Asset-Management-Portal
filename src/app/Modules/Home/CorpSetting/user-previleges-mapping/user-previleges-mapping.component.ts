import { Component, OnInit } from '@angular/core';
import { UserMappingService } from '../../../../Core/Service/user-mapping.service';
import { IFUserMapping } from '../../../../Core/Interface/userMapping.interface';
import { RbSpinnerService } from 'src/app/Core/Service/rb-spinner.service';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-user-previleges-mapping',
  templateUrl: './user-previleges-mapping.component.html',
  styleUrls: ['./user-previleges-mapping.component.scss']
})
export class UserPrevilegesMappingComponent implements OnInit {

  constructor(private userMapping: UserMappingService, private spinner: RbSpinnerService, private ngSnackbar: MatSnackBar) { }

  userTypeMapping: any;
  userTypeMappingDefault: any;
  restoreToDefault = false;
  previlages = ['Administrative', 'Gatekeeping', 'Standard', 'Installation'];
  tenantUserType = ['superAdmin', 'standard'];
  nonTenantUserType = ['standard', 'administrator'];
  userType = ['superAdmin', 'standard'];
  newData: any = {};
  userPrevilageMapping: IFUserMapping = {
    userMapType: '',
    data: {
      custom: {
        superAdmin: [],
        standard: [],
        administrator: []
      }
    }
  };

  /** Data Parser Function to dynamically create the tenantUser or nonTenantUser Objects */
  dataParser(data) {
    if (localStorage.getItem('upUserLevel') === 'tenant') {
      this.userType = this.tenantUserType;
    } else {
      this.userType = this.nonTenantUserType;
    }
    console.log(this.userType);
    this.userType.forEach((ele) => {
      this.newData[ele] = [];
      this.previlages.forEach((item) => {
        if (data[ele]) {
          if (localStorage.getItem('upUserLevel') === 'tenant') {
            if ((ele === 'superAdmin') && (item === 'Administrative' || item === 'Gatekeeping')) {
              this.newData[ele].push({ userPrevilage: item, isChecked: data[ele].includes(item), isDisabled: true });
            } else {
              this.newData[ele].push({ userPrevilage: item, isChecked: data[ele].includes(item), isDisabled: false });
            }
          } else {
            if (ele === 'administrator' && item === 'Gatekeeping') {
              this.newData[ele].push({ userPrevilage: item, isChecked: data[ele].includes(item), isDisabled: true });
            } else {
              this.newData[ele].push({ userPrevilage: item, isChecked: data[ele].includes(item), isDisabled: false });
            }
          }
        } else {
          this.newData[ele].push({ userPrevilage: item, isChecked: false, isDisabled: false });
        }
      });
    });

  }
  /** Data Parser Function ends here */

  /** Restore to default functionality */
  changeToDefault() {
    this.restoreToDefault = !this.restoreToDefault;
    this.dataParser(this.restoreToDefault ? this.userTypeMappingDefault : this.userTypeMapping);
  }
  /** Restore to default functionality ends here */

  /** Add user previlages function */
  addUserPrevilages() {
    if (localStorage.getItem('upUserLevel') === 'tenant') {
      this.userPrevilageMapping.userMapType = 'tenantUsers';
      if (this.restoreToDefault === true) {
        this.dataParser(this.restoreToDefault ? this.userTypeMappingDefault : this.userTypeMapping);
      }
    } else {
      this.userPrevilageMapping.userMapType = 'nonTenantUsers';
      if (this.restoreToDefault === true) {
        this.dataParser(this.restoreToDefault ? this.userTypeMappingDefault : this.userTypeMapping);
      }
    }
    for (const key in this.newData) {
      if (this.newData.hasOwnProperty(key)) {
        this.newData[key].forEach(previlage => {
          if (previlage.isChecked) {
            this.userPrevilageMapping.data.custom[key].push(previlage.userPrevilage);
          }
        });
      }
    }
    this.userMapping.saveUserPrevilages(this.userPrevilageMapping).subscribe((res: any) => {
      this.onSpinner(true);
      if (res.status === 'success') {
        this.ngSnackbar.open('Success: ' + res.message, 'OK', { duration: 2000, panelClass: 'alert-info' });
        this.onSpinner(false);
      }
    },
      (err) => {
        // tslint:disable-next-line:no-trailing-whitespace
        console.log(err);
        this.onSpinner(false);
      });
  }
  /** Add user previlages function ends here */


  /** Get user previlage mapping functionality */
  getUserPrevilageMapping() {
    this.userMapping.getUserPrevilages().subscribe((res: any) => {
      this.onSpinner(true);
      if (localStorage.getItem('upUserLevel') === 'tenant') {
        this.userTypeMapping = res.tenantUsers.custom;
        this.userTypeMappingDefault = res.tenantUsers.default;
        this.dataParser(this.userTypeMapping);
        this.onSpinner(false);
      } else {
        this.userTypeMapping = res.nonTenantUsers.custom;
        this.userTypeMappingDefault = res.nonTenantUsers.default;
        this.dataParser(this.userTypeMapping);
        this.onSpinner(false);
      }
    },
      (err) => {
        // tslint:disable-next-line:no-trailing-whitespace
        console.log(err);
        this.onSpinner(false);
      });
  }
  /** Get user previlage mapping functionality ends here */

  ngOnInit() {
    this.getUserPrevilageMapping();
  }

  onSpinner(status: boolean) {
    setTimeout(() => {
      this.spinner.onRBSpinner$(status);
    });
  }
}
