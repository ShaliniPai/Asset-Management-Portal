import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SigninService {
  authReq = environment.authReq;

  constructor(private http: HttpClient, private router: Router) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };



  // signin(email:string,password:string){
  //   console.log(email);
  //   this.http.post("https://dev.bosch-connected-elevators.com/api/user/auth/login", {email:email,pasword:password}, this.httpOptions)
  //   .subscribe(data => {
  //     console.log(data['_body']);
  //    }, error => {
  //     console.log(error);
  //   });
  //   console.log("Done");
  // }


  /* CALLING API FOR AUTHENTICATION, LOGIN */
  signin(userEmail: string, pwd: string) {
    const val = { email: userEmail, password: pwd };
    return this.http.post(environment.authReqLocal, val);
  }


}
