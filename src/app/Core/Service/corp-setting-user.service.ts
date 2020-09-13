import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CorpSettingUserService {

  url = environment.metrics;

  constructor(private http: HttpClient, private router: Router) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  /* CALLING API FOR DELETING USER */
  deleteUser(id: any) {
    return this.http.put(this.url + 'users/deleteUser', id);
  }

  /* CALLING API FOR UPDATING USER */
  updateUser(user: any) {
    return this.http.put(this.url + 'users/updateUser', user);
  }

}

