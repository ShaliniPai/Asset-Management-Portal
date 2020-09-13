import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { IFUserMapping } from '../Interface/userMapping.interface';


@Injectable({
  providedIn: 'root'
})
export class UserMappingService {

  url = environment.metrics;
  constructor(private http: HttpClient) { }

  getUserPrevilages() {
    return this.http.get(this.url + 'userMapping/get')
      .pipe(catchError(err => this.handleError(err)));
  }

  saveUserPrevilages(payload: IFUserMapping) {
    console.log(payload);
    return this.http.post(this.url + 'userMapping/save', payload)
      .pipe(catchError(err => this.handleError(err)));
  }

  /** Error Handler */
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
