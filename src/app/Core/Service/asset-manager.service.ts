import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetManagerService {
  url = environment.metrics;

  constructor(private http: HttpClient, private router: Router) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  /* CALLING API FOR GET ASSET */
  getAsset() {
    return this.http.get(this.url + 'assets/showAssets');
  }

  /* CALLING API FOR GET BLOCK */
  getBlock(locIdObj: any) {
    console.log(locIdObj);
    return this.http.post(this.url + 'assets/getBlock', locIdObj);
  }

  /* CALLING API  FOR ADD ASSET*/
  addAsset(asset: any) {
    return this.http.post(this.url + 'assets/addAsset', asset);
  }

  /* CALLING API  FOR ADD DEVICE*/
  addSensorHwId(dev: any) {
    return this.http.post(this.url + 'assets/addDevice', dev);
  }

  /* CALLING API  FOR UPDATE ASSET*/
  updateAsset(asset: any) {
    return this.http.put(this.url + 'assets/updateAsset', asset);
  }

  /* CALLING API  FOR ADD BLOCK*/
  addBlock(block: any) {
    return this.http.post(this.url + 'assets/addBlock', block);
  }

  /* CALLING API FOR GET BLOCK */
  getAssetDetail(assetIdObj: any) {
    return this.http.post(this.url + 'assets/showAssets/assetDetails', assetIdObj);
  }

}
