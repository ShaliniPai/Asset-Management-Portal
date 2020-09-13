import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RbSpinnerService {

  private rxbsSpinner = new BehaviorSubject<boolean>(false);
  rbSpinner: Observable<boolean> = this.rxbsSpinner.asObservable();
  constructor() { }

  /**
   * Update the Global spinner using rxjs observables
   * @param status:boolean
   */
  onRBSpinner$(status: boolean) {
    this.rxbsSpinner.next(status);
  }
}
