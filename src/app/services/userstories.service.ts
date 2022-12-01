import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import type {Userstories} from "../class/userstories";
import {UserStoryStatus} from "../class/user-story-status";

@Injectable({
  providedIn: 'root'
})
export class UserstoriesService {

  apiUserstoriesUrl = environment.api + "userstories";
  apiUserstoriesStatusUrl = environment.api + "userstory-statuses";

  constructor(private httpClient: HttpClient, private router: Router) {
  }


  // Method for getting all userstories
  getAllUserstories(): Observable<Userstories[]> {
    const token = localStorage.getItem('token');
    return this.httpClient.get<Userstories[]>(this.apiUserstoriesUrl, {headers: {Authorization: `Bearer ${token}`}});
  }

  // Method for update userstories by id
  updateUserstory(userstory: Userstories): Observable<Userstories> {
    const token = localStorage.getItem('token');
    return this.httpClient.patch<Userstories>(this.apiUserstoriesUrl + '/' + userstory.id, userstory, {headers: {Authorization: `Bearer ${token}`}});
  }

  // Method for get userstory-statuses with id one userstory
  getUserstoryStatuses(id: number): Observable<UserStoryStatus> {
    const token = localStorage.getItem('token');
    return this.httpClient.get<UserStoryStatus>(this.apiUserstoriesStatusUrl + '/' + id, {headers: {Authorization: `Bearer ${token}`}});
  }

  // Method for update userstory-statuses
  updateUserstoryStatuses(userstoryStatuses: UserStoryStatus): Observable<UserStoryStatus> {
    const token = localStorage.getItem('token');
    return this.httpClient.patch<UserStoryStatus>(this.apiUserstoriesStatusUrl + '/' + userstoryStatuses.id, userstoryStatuses, {headers: {Authorization: `Bearer ${token}`}});
  }

  // Method for add userstories
  addUserstory(userstory: Userstories): Observable<Userstories> {
    const token = localStorage.getItem('token');
    return this.httpClient.post<Userstories>(this.apiUserstoriesUrl, userstory, {headers: {Authorization: `Bearer ${token}`}});
  }

}
