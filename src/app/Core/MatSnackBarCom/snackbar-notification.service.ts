import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SnackMessageComponent } from './snack-message/snack-message.component';


@Injectable({
  providedIn: 'root'
})
export class SnackbarNotificationService {

  constructor(private snackbar: MatSnackBar) { }
  /**
   *
   * @param Status success or error
   * @param Message Information that would like to show
   * @param Duration In Milliseconds optional Default 2000, enable for set custom value
   * @param ActionName Action Name use to close Snackbar before end given duration time
   */
  onOpenSnack(Status: string, Message: string, Duration?: number, ActionName?: string) {
    this.snackbar.openFromComponent(SnackMessageComponent,
      {
        duration: Duration || 2000,
        panelClass: Status.toLowerCase() === 'success' ? 'cs-snack-success' : 'cs-snack-error',
        data: { status: Status, message: Message, action: ActionName || '' }
      });
  }
}
