import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ForgotPasswordService } from 'src/app/Core/Service/forgot-password.service';
import { SnackbarNotificationService } from 'src/app/Core/MatSnackBarCom/snackbar-notification.service';
import { relativeTimeRounding } from 'moment';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {
  emailId;
  public otpSent = false;
  emailControl;
  OTPControl;
  otp;
  otpValue: any;
  userName: any;
  submitOtpValue: any;
  forgotPasswordPayload: any;
  otpForm: FormGroup;
  // tslint:disable-next-line:max-line-length
  constructor(private fb: FormBuilder, private router: Router, private httpClient: HttpClient, private forgotPasswordService: ForgotPasswordService, private ngSnackbar: SnackbarNotificationService) {
   }

   ngOnInit() {
    this.otpForm = this.fb.group({
      emailControl: ['', Validators.required],
      OTPControl: ['', Validators.required],
      emailId: [''],
      otp: ['']
    });
  }

  generateOtp(emailId): void {
    this.userName = emailId;
    this.forgotPasswordService.sendOtp(this.userName).subscribe((res: any) => {
      if ( res.success === true ) {
        // tslint:disable-next-line:max-line-length
        this.ngSnackbar.onOpenSnack( 'success', 'OTP has been sent to register Mobile number and Email ID');
      }
      this.otpSent = true;
    }, err => {
      console.log(err);
    });
  }

  submitOtp(otpValue): void {
    this.submitOtpValue = {
      otp: otpValue,
      userName: this.otpForm.controls.emailId.value
    };
    this.forgotPasswordService.verifyOtp(this.submitOtpValue).subscribe( (res: any) => {
      if (res.success === true) {
        this.forgotPasswordService.setUserName(this.otpForm.controls.emailId.value);
        this.router.navigate(['auth/changePassword']);
        this.ngSnackbar.onOpenSnack( 'success', res.message);
      } else {
        this.ngSnackbar.onOpenSnack( 'error', res.message);
      }
      // this.ngSnackbar.onOpenSnack( 'success', res.message);
    }, err => {
      console.log(err);
    });
  }


  // forgetPassword(forgetEmail:NgForm):void{
  //   // this.f
  // }

  onclick_RedirectTOLoginPage() {
    this.router.navigate(['home/login']);
  }

  alreadyHaveOtp() {
    this.otpSent = true;
  }
}
