import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewAssetService {

  private assetDetails = new BehaviorSubject('default message');
  currentAssetDetails = this.assetDetails.asObservable();

  constructor() { }

  setAssetDetails(asset: any) {
    this.assetDetails.next(asset);
  }
}
