import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatFormFieldControl, MatSnackBar } from '@angular/material';
import { ResetPasswordService } from 'src/app/Core/Service/reset-password.service';

export interface DialogData {
  currentPass: string;
  newPass: string;
  confirmNewPass: string;
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [{provide: MatFormFieldControl, useExisting: ResetPasswordComponent}],
})
export class ResetPasswordComponent implements OnInit {

// variable
show: boolean;
showNewPassEye = false;
showConfirmPassEye = false;

  // oLoginUser: IFLoginuserInfo;
  constructor(private fb$: FormBuilder, private router: Router, public dialog: MatDialog, private ngSnackbar: MatSnackBar,
              public dialogRef: MatDialogRef<ResetPasswordComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private resetPasswordService: ResetPasswordService
    ) { }

    // click event function toggle
password() {
  this.show = !this.show;
}
  ngOnInit() {
    this.show = false;
    console.log(this.show);

    /** Get User Info from rxjs objects */
    // this.login$.loginUser_$.subscribe((obj) => { this.oLoginUser = obj; });
  }

  resetPassword(oldPassword, newPassword, confirmNewPassword) {
    if ( newPassword !== confirmNewPassword ) {
      this.ngSnackbar.open('New password and Confirm Password should match.', 'OK', { duration: 2000, panelClass: 'alert-info'});
      return;
    }
    const resetPasswordObject = { oldPassword, newPassword };
    this.resetPasswordService.resetPassword(resetPasswordObject).subscribe( (res: any) => {
      if (res.success) {
        this.ngSnackbar.open(res.message, 'OK', { duration: 2000, panelClass: 'snackbar-success'});
        this.dialogRef.close();
      } else {
        this.ngSnackbar.open(res.message, 'OK', { duration: 2000, panelClass: 'alert-info'});
      }
    });
  }

  showNewPassword() {
    this.showNewPassEye = !this.showNewPassEye;
  }

  showConfirmPassword() {
    this.showConfirmPassEye = !this.showConfirmPassEye;
  }

  clear() {
    console.log(this.data.currentPass);
    this.showNewPassEye = false;
    this.showConfirmPassEye = false;
    this.data.newPass = '';
    this.data.currentPass = '';
    this.data.confirmNewPass = '';
  }

  close() {
    this.dialogRef.close();
  }

}
