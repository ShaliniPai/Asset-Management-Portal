import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { IFUserEntity } from '../Interface/userEntity.interface';


@Injectable({
  providedIn: 'root'
})
export class UserEntityService {

  url = environment.metrics;
  constructor(private http: HttpClient) { }

  saveUserEntity(payload: IFUserEntity) {
    console.log(payload);
    return this.http.post(this.url + 'users/save', payload)
      .pipe(catchError(err => this.handleError(err)));
  }

  /** Error Handler */
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
