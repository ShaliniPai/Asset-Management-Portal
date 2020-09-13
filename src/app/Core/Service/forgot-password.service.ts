// Added By Vishal
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { IFForgotPassword } from '../Interface/forgotPassword.interface';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  url = environment.metrics;
  userNameTransferToCP: string;                          // Transfer the username to Change Password Screen

  constructor(private http: HttpClient, private router: Router) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  /* CALLING API FOR AUTHENTICATION, LOGIN */
  sendOtp(userName: any) {
      return this.http.post(this.url + 'user/forgotPassword/generateOtp', {userName});
  }

  verifyOtp(verifyOtp: any) {
      return this.http.post(this.url + 'user/forgotPassword/verifyOtp', verifyOtp);
  }

  forgotPassword(forgotPasswordObject: IFForgotPassword) {
    return this.http.post(this.url + 'user/changePassword', forgotPasswordObject);
}

 setUserName(userName: string) {
   this.userNameTransferToCP = userName;
 }

 getUserName(): string {
   return this.userNameTransferToCP;
 }
}
