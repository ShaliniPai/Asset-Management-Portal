import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimezoneService {

  constructor(private http: HttpClient) { }
  getTimezones() {
    return this.http.get('/assets/json/mock.timezone.json');
  }
}
