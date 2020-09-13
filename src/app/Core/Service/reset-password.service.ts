// Added By Vishal
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { IFResetPassword } from '../Interface/resetPassword.interface';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  url = environment.metrics;
  constructor(private http: HttpClient, private router: Router) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  resetPassword(resetPasswordObject: IFResetPassword) {
    console.log(resetPasswordObject);
    return this.http.post(this.url + 'changePassword', resetPasswordObject);
  }

}
