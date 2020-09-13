import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import {Subject, throwError, BehaviorSubject, Observable } from 'rxjs';
// import {LossReviewComponent}  from 'src/app/Modules/LossReview/loss-review/loss-review.component';

@Injectable({
    providedIn: 'root'
  })
  export class AlertsNotifServiceComponent {

    environment = environment.alertNotifications;
    public _URL = this.environment;
    constructor(private http: HttpClient) { }
    fs_createEvent(data) {
      return this.http.post(`${this._URL}/api/alerts/createEvent`, data);
    }
    fs_getEvents() {
      return this.http.get(`${this._URL}/api/alerts/getEvents`, {responseType: 'json'});
    }
    fs_getAssets() {
      return this.http.get(`${this._URL}/api/assets/getAssets`);
    }
    fs_deleteEvent(id) {
      return this.http.put(`${this._URL}/api/alerts/deleteEvent`, {id});
    }
    fs_getNotifications() {
      return this.http.get(`${this._URL}/api/alerts/getNotifications`);
    }
    fs_muteNotifications(id) {
      return this.http.put(`${this._URL}/api/alerts/muteNotifications`, {id});
    }
    fs_getUsers() {
      return this.http.get(`${this._URL}/api/alerts/getUsers`);
    }
  }
