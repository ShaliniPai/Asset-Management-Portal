import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthService {
    url = environment.metrics;
    constructor(private http: HttpClient) { }

    public getAssets() {
        return this.http.get(this.url + 'assets/getAssets').pipe(catchError(err => this.handleError(err)));
    }

    /** Error Handler */
    handleError(error: HttpErrorResponse) {
        return throwError(error);
    }
}
