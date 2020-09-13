import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, SimpleSnackBar, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-snack-message',
  templateUrl: './snack-message.component.html',
  styleUrls: ['./snack-message.component.scss']
})
export class SnackMessageComponent implements OnInit {

  snackbarData: IFSnackbar;
  constructor(@Inject(MAT_SNACK_BAR_DATA) public InjectSnackData: any, private matSnackbar: MatSnackBar) {
    this.snackbarData = this.InjectSnackData;
  }

  ngOnInit() { }

  onSnackDismiss() {
    this.matSnackbar.dismiss();
  }

}

export interface IFSnackbar {
  status: string;
  message: string;
  action: string;
}
