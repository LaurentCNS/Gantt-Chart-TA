import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {User} from "../class/user";
import jwtDecode from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiLoginUrl = environment.api + "auth";
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  // Method for login and get data from user
  signIn(username: string, password: string): Observable<User> {
    return this.httpClient.post<User>(this.apiLoginUrl, {username, password, type: "normal"});
  }

  // Method for save user data after login in local storage
  saveUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Method for get user data from local storage
  getUser(): User {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  // Method for logout
  signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigateByUrl('/');
  }

  // Method for checking if user and token are in local storage
  isAuthenticated(): boolean {
    if (localStorage.getItem('token') && localStorage.getItem('user')) {
      return true;
    } else {
      return false;
    }
  }

  // Method for checking token validity
  isTokenValid(): boolean {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      if (typeof token === 'string') {
        let decodedToken: any = jwtDecode(token);
        let dateNow = new Date();
        let timestampNow = Math.round(dateNow.getTime() / 1000);
        if (timestampNow < decodedToken.exp) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  // Method for return a number of seconds until the token expires
  getSecondsUntilTokenExpires(): number {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      if (typeof token === 'string') {
        let decodedToken: any = jwtDecode(token);
        let dateNow = new Date();
        let timestampNow = Math.round(dateNow.getTime() / 1000);
        return decodedToken.exp - timestampNow;
      }
      return 0;
    } else {
      return 0;
    }
  }

}
