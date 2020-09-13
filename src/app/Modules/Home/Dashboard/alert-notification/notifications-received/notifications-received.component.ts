import { Component, OnInit } from '@angular/core';
import { AlertsNotifServiceComponent } from 'src/app/Core/Service/alerts-notification.service';
import * as moment from 'moment';
import { RbSpinnerService } from 'src/app/Core/Service/rb-spinner.service';
import { MatSnackBar } from '@angular/material';
import { AuthorizationService } from 'src/app/Core/Service/authorization.service';

@Component({
  selector: 'app-notifications-received',
  templateUrl: './notifications-received.component.html',
  styleUrls: ['./notifications-received.component.scss']
})
export class NotificationsReceivedComponent implements OnInit {
  otblColumns: string[];
  bNotificationData: [];
  // bNotificationData: any[] = [
  //   {
  //     userId: 2,
  //     updatedAt: '01 Aug, 2018 10:45am',
  //     asset: 'Machine_01',
  //     description: 'Email',
  //     esclvl: 2,
  //     criteria: 'Idle longer than',
  //     mute: { data: { id: 4, muted: 3 }}
  //   },
  //   {
  //     userId: 1,
  //     updatedAt: '14 Aug, 2018 10:45am',
  //     asset: 'Machine_02',
  //     description: 'SMS,Email',
  //     criteria: 'Utilization less than',
  //     esclvl: 20,
  //     mute: { data: { id: 12, muted: 56}}
  //   }
  // ];
  constructor(private alerts$: AlertsNotifServiceComponent, private spinner: RbSpinnerService, private ngSnackbar: MatSnackBar, public $auth: AuthorizationService) { }

  ngOnInit() {
    this.getNotificationsData();
    this.onAuthPermission();
  }

  /**
   *  Authorization : Give the Mute permission only to Standard
   *  For that check login user having role as 'Standard'
   */
  onAuthPermission() {
    // Only Login user has Standard/Administrator/Gatekeeper then enable mute option
    if (this.$auth.$grantAccess('A') || this.$auth.$grantAccess('G') || this.$auth.$grantAccess('S')) {
      this.otblColumns = ['userId', 'updatedAt', 'asset', 'description', 'medium', 'esclvl', 'createdBy', 'mute'];
    } else {
      this.otblColumns = ['userId', 'updatedAt', 'asset', 'description', 'medium', 'esclvl', 'createdBy'];
    }
  }
  /* istanbul ignore next */
  muteNotifications(muteId) {
    this.onSpinner(true);
    this.alerts$.fs_muteNotifications(muteId).subscribe((res: any) => {
      this.onSpinner(false);
      this.ngSnackbar.open('Event Muted Successfully', 'OK', { duration: 2000, panelClass: 'snackbar-success' });
      console.log(res);
    }, (err) => {
      console.log(err);
      this.onSpinner(false);
    });
    this.getNotificationsData();
  }

  /* istanbul ignore next */
  getNotificationsData() {
    this.onSpinner(true);
    this.alerts$.fs_getNotifications().subscribe((res: any) => {
      this.bNotificationData = res;
      this.onSpinner(false);
      let notification: any;
      for (notification of this.bNotificationData) {
        notification.createdAt = moment(notification.createdAt).format('hh:mmA, MMM-DD-Y');
        if (notification.criteria === 'I-L') {
          notification.criteria = 'Idle longer than';
        } else if (notification.criteria === 'A-O') {
          notification.criteria = 'Asset ON during non-operational hours more than';
        } else if (notification.criteria === 'D-L') {
          notification.criteria = 'Down-OFF longer than';
        } else if (notification.criteria === 'U-L') {
          notification.criteria = 'Utilization less than';
        } else if (notification.criteria === 'D-D') {
          notification.criteria = 'DOWNTIME per day greater than';
        } else if (notification.criteria === 'E-D') {
          notification.criteria = 'ENERGY per day greater than';
        } else if (notification.criteria === 'U-LT') {
          notification.criteria = 'Utilization less than';
        }
      }
    });
  }

  /* istanbul ignore next */
  onDisabledForMute(row): boolean {
    if (row.muted === 1) {
      return true;
    }
    return false;
  }

  onSpinner(status: boolean) {
    setTimeout(() => {
      this.spinner.onRBSpinner$(status);
    }, 1500);
  }
}
