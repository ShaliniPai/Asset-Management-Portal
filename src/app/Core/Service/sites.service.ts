import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SitesService {

  url = environment.metrics;
  // url = '/assets/json/mock.sites.json';
  constructor(private http: HttpClient) { }

  public getSites() {
    return this.http.get(this.url + 'site/get').pipe(catchError(err => this.handleError(err)));
  }

  public getZone() {
    return this.http.get(this.url + 'zone/get').pipe(catchError(err => this.handleError(err)));
  }
  public addZone(zonename: string) {
    return this.http.post(this.url + 'zone/add', { zname: zonename }).pipe(catchError(err => this.handleError(err)));
  }

  public saveSite(formData: any[], saveType: string) {
    if (saveType === 'add') {
      delete formData['_id'];
      return this.http.post(this.url + 'site/add', formData).pipe(catchError(err => this.handleError(err)));
    } else {
      return this.http.put(this.url + 'site/update', formData).pipe(catchError(err => this.handleError(err)));
    }
  }

  /** Error Handler */
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
