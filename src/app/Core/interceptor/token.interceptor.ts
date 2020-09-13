import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router, private ngSnackbar: MatSnackBar) { }
  intercept(req, next) {
    const token = localStorage.getItem('upToken');
    if (!!localStorage.getItem('upToken')) {
      /* Add headers only for IE browser to clear cache on every request */
      const isIE = /*@cc_on!@*/false || !!document['documentMode'];
      let headers = {};
      if (isIE) {
        headers = {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          Pragma: 'no-cache',
          Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
          'If-Modified-Since': '0'
        };
      } else {
        headers = { Authorization: `Bearer ${token}` };
      }
      const tokanizedReq = req.clone({
        setHeaders: headers
      });
      req.headers.set('Accept', '*/*');
      req.headers.set('Content-Type', 'text/plain');
      return next.handle(tokanizedReq).pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            // const elapsed = Date.now();
            // console.log(`Request for ${req.urlWithParams} took ${elapsed} ms.`);
          }
        }, error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              localStorage.clear();
              this.router.navigateByUrl('auth/login?sessiontimedout=true');
              this.ngSnackbar.open(error.error.message, 'OK', { duration: 2500, panelClass: 'alert-info'});
              console.log(error.error);
              // this.AuthenticationService.sessionexpirymessage
              // = (error.error['error']) ? error.error['error'] : 'Session got expired please login again';
            }
          }
        })
      );
    }
    return next.handle(req);
  }
}
