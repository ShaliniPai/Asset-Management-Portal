import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { AlertsNotifServiceComponent } from 'src/app/Core/Service/alerts-notification.service';
import { RbSpinnerService } from 'src/app/Core/Service/rb-spinner.service';
import { AuthorizationService } from 'src/app/Core/Service/authorization.service';

@Component({
  selector: 'app-currentdefinedevent',
  templateUrl: './current-defined-events.component.html',
  styleUrls: ['./current-defined-events.component.scss']
})
export class CurrentDefinedEventsComponent implements OnInit {
  otblColumns: string[];
  criteria: any[] = ['Idle longer than'];
  param: any[] = [''];
  suffix: any[] = [''];
  mode: any[] = ['SMS'];
  level1: any[] = [''];
  level2: any[] = [''];
  events: any;
  bMatrixdata: any;
  temp;
  bTreeViewMachine: any;
  oMsgForMahineSelection: string;
  bMachineInfo: any;
  PassDeviceid: any;
  MachineName: any[] = [''];
  bNotificationData: any[];
  bMatrixdataTemp: any = [];
  id: any;
  MuteData: { 'data': { 'id': any; 'muted': number; }; };
  bMatrixMute: any;
  response: any;
  ConfirmDeletion = false;
  DeleteId: any;
  IsDel = false;
  Message: string;
  isEnableSpinner = true;

  constructor(
    private alerts$: AlertsNotifServiceComponent,
    private ngSnackbar: MatSnackBar,
    private spinner: RbSpinnerService,
    public $auth: AuthorizationService,
  ) {
  }

  ngOnInit() {
    this.getEventsData();
    this.onAuthPermission();
  }

  /**
   * Authorization : Give the delete permission only to Standard
   * For that check login user having role as 'Standard'
   */
  onAuthPermission() {
    const grantAccess = this.$auth.$grantAccess('S');
    if (grantAccess === true) {
      this.otblColumns = ['sno', 'asset', 'criteria', 'medium', 'lvl1', 'lvl2', 'lvl3', 'delete'];
    } else {
      this.otblColumns = ['sno', 'asset', 'criteria', 'medium', 'lvl1', 'lvl2', 'lvl3'];
    }
  }
  // On click of Confirm Deletion after pressing Delete
  Delete(id) {
    this.DeleteId = id;
    this.ConfirmDeletion = true;
  }

  // On clicking delete button
  ConfirmDelete() {
    this.onSpinner(true);
    this.alerts$.fs_deleteEvent(this.DeleteId).subscribe(
      (data: any) => {
        this.response = data;
        console.log('response', this.response);
        this.onSpinner(false);
        if (this.response.deletedCount === 1) {
          this.getEventsData();
          this.IsDel = true;
          this.Message = 'Event Deleted';
          this.ngSnackbar.open('Event deleted', 'OK',
            { duration: 2000, panelClass: 'alert-info' });
          setTimeout(() => {
            if (this.IsDel === true) {
              this.IsDel = false;
              //     this.spinner.rbSpinner$(false);
            }
          }, 5000);
        } else {
          console.log(this.response);
          //   this.IsDel = false;
        }
      },
      error => {
        console.error(error);
        this.onSpinner(false);
      }
    );
    this.ConfirmDeletion = false;
  }

  // On clicking Cancel button after clicking delete button
  Cancel() {
    this.ConfirmDeletion = false;
  }

  // Getting Events from API
  getEventsData() {
    // this.onSpinner(true);
    this.alerts$.fs_getEvents().subscribe((res: any) => {
      this.events = res;
      this.onSpinner(false);
      this.events.forEach(element => {
        if (element.criteria === 'I-L') {
          element.criteria = 'Idle longer than';
        } else if (element.criteria === 'A-O') {
          element.criteria = 'Asset ON during non-operational hours more than';
        } else if (element.criteria === 'D-L') {
          element.criteria = 'Down-OFF longer than';
        } else if (element.criteria === 'U-L') {
          element.criteria = 'Utilization less than';
        } else if (element.criteria === 'D-D') {
          element.criteria = 'DOWNTIME per day greater than';
        } else if (element.criteria === 'E-D') {
          element.criteria = 'ENERGY per day greater than';
        } else if (element.criteria === 'U-LT') {
          element.criteria = 'Utilization less than';
        }
      });
    }, err => {
      console.log(err);
      this.onSpinner(false);
    });
  }

  // Spinner function to add spinner till data loads
  onSpinner(status: boolean) {
    setTimeout(() => {
      this.spinner.onRBSpinner$(status);
    });
  }

}
