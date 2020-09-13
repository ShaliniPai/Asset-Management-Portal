import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ForgotPasswordService } from 'src/app/Core/Service/forgot-password.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  // varialbe to change when the password is successfully changed
  public passwordChanged = false;
  changePasswordPayload: any;
  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private http: HttpClient, private ngSnackBar: MatSnackBar, private forgotPasswordService: ForgotPasswordService) { }

  password;
  conPassword = '';
  getUserNameFromFP;                            // To Get username from Forgot password Screen
  ngOnInit() {
  }

  changePassword(changePassword: NgForm): void {
    this.getUserNameFromFP = this.forgotPasswordService.getUserName();
    this.changePasswordPayload = {
      userName: this.getUserNameFromFP,
      newPassword: changePassword.value.password
    };
    if (changePassword.value.password !==  changePassword.value.conPassword) {
      this.ngSnackBar.open('Passwords do not match', '', { duration: 2000, panelClass: 'alert-info'});
      return;
    }
    this.forgotPasswordService.forgotPassword(this.changePasswordPayload).subscribe((res: any) => {
      if ( res.success === true ) {
        this.ngSnackBar.open( res.message, 'OK', { duration: 2000, panelClass: 'snackbar-success' });
        this.router.navigate(['home/login']);
      } else {
        this.ngSnackBar.open('Could not change password. Please try again later', 'OK');
      }
    }, (err) => {
      this.ngSnackBar.open('Could not change password. Please try again later', 'OK');
    });
  }

  forgotPassword(emailId: string, newPassword: string): void {
    
    

  }

}
