import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddOEMService {
  url = environment.metrics;
  constructor(private http: HttpClient, private router: Router) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  addOemName(name: string) {
     return this.http.post(this.url + 'assets/addOemName', {name});
  }

  getOemNames() {
    return this.http.get(this.url + 'assets/getOemNames');
 }

}
