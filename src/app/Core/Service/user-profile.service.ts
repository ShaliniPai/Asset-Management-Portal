import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { IFUserMapping } from '../Interface/userMapping.interface';
import { IFUserProfile } from '../Interface/userProfile.interface';
import { IFUpdateUserProfile } from '../Interface/updateUserProfile.interface';


@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  url = environment.metrics;
  constructor(private http: HttpClient) { }

  getUserProfile() {
    return this.http.get( this.url + 'users/viewUserProfile')
      .pipe(catchError(err => this.handleError(err)));
  }

  updateUserProfile(payload: IFUpdateUserProfile) {
    return this.http.post(this.url + 'users/updateUserProfile', payload)
      .pipe(catchError(err => this.handleError(err)));
  }

  verifyEmail(otpCodeVerify: string) {
    return this.http.post(this.url + 'users/verifyEmail', { otpCodeVerify })
      .pipe(catchError(err => this.handleError(err)));
  }

  verifyPhone(otpCodeVerify: string) {
    return this.http.post(this.url + 'users/verifyPhone', { otpCodeVerify })
      .pipe(catchError(err => this.handleError(err)));
  }

  /** Error Handler */
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
