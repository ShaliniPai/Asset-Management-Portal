import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GetUserService {

  url = environment.metrics;
  constructor(private http: HttpClient, private router: Router) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  /* CALLING API FOR AUTHENTICATION, LOGIN */
  getUser() {
    return this.http.get(this.url + 'users/getUsers');
  }

  deleteUser(id: any) {
    return this.http.put(this.url + 'users/deleteUser', id);
  }
}

