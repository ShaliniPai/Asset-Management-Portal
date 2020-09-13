import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs';
import { SigninService } from 'src/app/Core/Service/signin.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private signinService: SigninService) {

  }

  emailId;
  password;

  credMessage: string;

  login(login: NgForm): void {
    this.signinService.signin((login.value.emailId).toLowerCase(), login.value.password).subscribe((res: any) => {
      if (res && res.token) {
        this.router.navigate(['home/suite/assetMonitoring/checkbox']);
        localStorage.setItem('upToken', res.token);
        localStorage.setItem('upTenantId', res.user.tenantId);
        localStorage.setItem('upUserLevel', res.userEntity.level);
        localStorage.setItem('upUserRole', res.user.userRole);
        localStorage.setItem('upUserEntity', res.userEntity.userEntity)
        if (res && res.userMapping) {
          localStorage.setItem('upUserMapping', JSON.stringify(res.userMapping.mapping));
        }
      } else {
        this.credMessage = res.error;
        console.log((res.success));
      }
    }, err => {
      console.log('err2 - ' + err);
    });
    // console.log(localStorage.getItem('CurrentUser'));

  }

  ngOnInit() {
  }

  onclick_RedirectTOForgotPassowrd() {
    this.router.navigate(['auth/forgotPassword']);

  }


}
