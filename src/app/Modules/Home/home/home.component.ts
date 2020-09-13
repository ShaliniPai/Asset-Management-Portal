import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, Event } from '@angular/router';
import { RbSpinnerService } from 'src/app/Core/Service/rb-spinner.service';
import { ResetPasswordComponent } from '../../Auth/reset-password/reset-password.component';
import { MatDialog } from '@angular/material';
import { AuthorizationService } from 'src/app/Core/Service/authorization.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userEntityName: String;
  currentPass: string;
  newPass: string;
  confirmNewPass: string;

  isCorEnabled: boolean;
  isUserEnabled: boolean;
  isEnableSpinner = true;
  isEnabledMonDetails = false;
  constructor(private router$: Router, private spinner$: RbSpinnerService, public dialog: MatDialog, public $auth: AuthorizationService) {
    this.onCurrentRouteState(this.router$.url);
    this.onActiveURl(this.router$.url);
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      data: { newPass: this.newPass, currentPass: this.currentPass, confirmNewPass: this.confirmNewPass }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.currentPass = result.newPass;
      console.log(result.currentPass + " " + result.newPass + " " + result.confirmNewPass);
    });
  }

  ngOnInit() {

    if (!!!localStorage.getItem('upToken')) {
      this.onLogout();
    }
    this.router$.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.onCurrentRouteState(routerEvent.url);
        this.onActiveURl(routerEvent.url);
      }

    });
    this.spinner$.rbSpinner.subscribe((val: boolean) => setTimeout(() => { this.isEnableSpinner = val; }));

    // getting user entity Name
    this.userEntityName=localStorage.getItem('upUserEntity');
  }

  /*** Corporate Settings
     * Enable the corporate settings nav bar based on urls
     * @url : url as form of string
     */
  onCurrentRouteState(url: string) {
    const path = url;
    if (path.includes('/corp/')) {
      this.isCorEnabled = true;
      this.isUserEnabled = false;
    } else if (path.includes('/user/')) {
      this.isCorEnabled = false;
      this.isUserEnabled = true;
    } else {
      this.isCorEnabled = false;
      this.isUserEnabled = false;
    }
  }

  /**
   * 
   * @param url : Url of details view - This config will active the 'Asset monitoring tab' when url is pointing to details view as well. 
   * Because details monitoring is part of Asset Monitoring page 
   */
  onActiveURl(url: string) {
    // console.log('url : ', url);
    if (url === '/home/monitoring/details') {
      this.isEnabledMonDetails = true;
    } else {
      this.isEnabledMonDetails = false;
    }
  }

  onLogout() {
    localStorage.clear();
    this.router$.navigate(['auth/login']);
  }
}
