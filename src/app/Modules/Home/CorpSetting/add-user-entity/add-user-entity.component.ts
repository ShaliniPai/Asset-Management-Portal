import { Component, OnInit } from '@angular/core';
import { IFTreeConfigDataModel } from '../../treeView/interface.treehierarchy';
import { environment } from '../../../../../environments/environment';
import { UserEntityService } from '../../../../Core/Service/user-entity.service';
import { IFUserEntity } from 'src/app/Core/Interface/userEntity.interface';
import { NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RbSpinnerService } from 'src/app/Core/Service/rb-spinner.service';
import { MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import * as data from 'src/assets/json/isdCodes.json';

@Component({
  selector: 'app-add-user-entity',
  templateUrl: './add-user-entity.component.html',
  styleUrls: ['./add-user-entity.component.scss']
})
export class AddUserEntityComponent implements OnInit {
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  phonePattern = '([+]?\d{1,2}[.-\s]?)?(\d{3}[.-]?){2}\d{4}';
  favDevices: any[] = [];
  selectedDevices: any[];
  assetInfo: any[];
  treeType: string;
  countryCode = '91';
  levelDetail: string;
  envURL = environment.metrics;
  public isdCodes: any = data;
  userEntity: IFUserEntity = {
    user: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      countryCode: '',
      unique_key: '',
      userRole: 'administrator'
    },
    userEntities: {
      userEntity: '',
      level: 'tenant',
      levelId: []
    }
  };
  treeViewConfig: IFTreeConfigDataModel;

  constructor(
    private addUserEntity: UserEntityService, private router: Router,
    private spinner: RbSpinnerService, private ngSnackbar: MatSnackBar) { }

  OPDefaultCheckList = [];

  ngOnInit() {
    this.onLevelChange('tenant');
  }

  onSpinner(status: boolean) {
    setTimeout(() => {
      this.spinner.onRBSpinner$(status);
    });
  }

  onLevelChange(val) {
    this.levelDetail = '';
    setTimeout(() => {
      if (val === 'tenant') {
        this.treeViewConfig = {
          url: `${this.envURL}assets/getAssets`,
          dataModel: [
            { valCol: 'tenantId', textCol: 'tenantName', isNotColumns: false },
            { valCol: 'zid', textCol: 'zname', isNotColumns: false },
            { valCol: 'locId', textCol: 'locName', isNotColumns: false },
            { valCol: 'bid', textCol: 'bname', isNotColumns: false }
          ]
        };
      } else if (val === 'zone') {
        this.treeViewConfig = {
          url: `${this.envURL}assets/getAssets`,
          dataModel: [
            { valCol: 'tenantId', textCol: 'tenantName', isNotColumns: false },
            { valCol: 'zid', textCol: 'zname', isNotColumns: false }
          ]
        };
      } else if (val === 'location') {
        this.treeViewConfig = {
          url: `${this.envURL}assets/getAssets`,
          dataModel: [
            { valCol: 'tenantId', textCol: 'tenantName', isNotColumns: false },
            { valCol: 'zid', textCol: 'zname', isNotColumns: false },
            { valCol: 'locId', textCol: 'locName', isNotColumns: false }
          ]
        };
      } else {
        this.treeViewConfig = {
          url: `${this.envURL}assets/getAssets`,
          dataModel: [
            { valCol: 'tenantId', textCol: 'tenantName', isNotColumns: false },
            { valCol: 'zid', textCol: 'zname', isNotColumns: false },
            { valCol: 'locId', textCol: 'locName', isNotColumns: false },
            { valCol: 'bid', textCol: 'bname', isNotColumns: false }
          ]
        };
      }
      this.levelDetail = val;
    }, 10);
  }

  /**
   * Checkbox selection changes
   *//* istanbul ignore next */
  onSelectItem(items: any[]) {
    this.userEntity.userEntities.levelId = [];
    items.forEach(item => {
      if (this.userEntity.userEntities.level === 'tenant') {
        this.userEntity.userEntities.levelId.push(item.tenantId);
      } else if (this.userEntity.userEntities.level === 'zone') {
        this.userEntity.userEntities.levelId.push(item.zid);
      } else if (this.userEntity.userEntities.level === 'location') {
        this.userEntity.userEntities.levelId.push(item.locId);
      } else if (this.userEntity.userEntities.level === 'block') {
        this.userEntity.userEntities.levelId.push(item.bid);
      } else {
        this.userEntity.userEntities.levelId.push(item.did);
      }
    });
  }

  /** Add user entity function */
  onSubmit(form: NgForm) {
    if (form.valid) {
      this.userEntity.user.countryCode = '+' + this.countryCode; //Adding countryCode in DB

      this.userEntity.user.phone = '+' + this.countryCode + this.userEntity.user.cusPhone;
      // console.log(this.userEntity);
      if (this.userEntity.userEntities.levelId && (this.userEntity.userEntities.levelId).length) {
        // tslint:disable-next-line:max-line-length
        this.addUserEntity.saveUserEntity(this.userEntity).subscribe((res: any) => {
          this.onSpinner(true);
          if (res.status === 'success') {
            this.ngSnackbar.open('Success: ' + res.message, 'OK', { duration: 5000, panelClass: 'snackbar-success' });
            this.onSpinner(false);
          }
          this.userEntity.userEntities.levelId = [];
          this.router.navigateByUrl('/home/corp/user');
        },
          (err) => {
            // tslint:disable-next-line:no-trailing-whitespace
            this.onSpinner(false);
            console.log(err);
            this.ngSnackbar.open('Failure: ' + err.error.message, 'OK', { duration: 5000, panelClass: 'alert-success' });
          });
      } else {
        // tslint:disable-next-line:max-line-length
        this.ngSnackbar.open('Kindly select the Level:  ' + this.userEntity.userEntities.level, 'OK', { duration: 5000, panelClass: 'alert-success' });
      }
    } else {
      this.ngSnackbar.open('Please fill in all the mandatory fields.', 'OK', { duration: 5000, panelClass: 'alert-success' });
    }
  }
  /** Add user entity function ends here */

}

