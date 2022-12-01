import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthentGuard implements CanActivate {
  constructor(private authService: AuthService) { }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let access = this.authService.isAuthenticated();
    let tokenValid = this.authService.isTokenValid();
    // Check if user is logged in and token is valid
    if (access && tokenValid) {
      return true;
    } else {
      this.authService.signOut();
      return false;
    }
  }



}
