import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  token: string;
  userObservable = new Subject<string>();
  
  private authenticatedUserUrl: string = 'http://localhost:8080/api/v1/authenticateUser';

  constructor(private http: HttpClient) { }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setUserName(userName) {
    localStorage.setItem('userName', userName);
  }

  getUserName() {
    return localStorage.getItem('userName');
  }

  saveUserData(token, userName) {
    this.setToken(token);
    this.setUserName(userName);
    this.userObservable.next(this.getUserName());
  }

  getUserData() {
    this.userObservable.next(this.getUserName());
    return this.userObservable;
  }

  clearUserData() {
    localStorage.clear();
  }

  authenticateUser(name, emailId, token) {
    return this.http.post<any>(this.authenticatedUserUrl, {name, emailId}, 
      {
      responseType: 'text' as 'json'
    });
  }
  
}
