import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {Projects} from "../class/projects";

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  apiProjectUrl = environment.api + "projects";
  isFullScreen = false;
  isProjectPage : boolean = false;

  constructor(private httpClient: HttpClient, private router: Router) { }


  // Method for getting all projects
  getAllProjects(): Observable<Projects[]> {
    const token = localStorage.getItem('token');
    return this.httpClient.get<Projects[]>(this.apiProjectUrl, {headers: {Authorization: `Bearer ${token}`}});
  }

  // Method for creating a new project
  createProject(project: Projects): Observable<Projects> {
    const token = localStorage.getItem('token');
    return this.httpClient.post<Projects>(this.apiProjectUrl, project, {headers : {Authorization: `Bearer ${token}`}});
  }

  // Set full screen mode
  fullScreenOn(){
    let elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      this.isFullScreen = true;
    }
  }

  fullScreenOff(){
    if (document.exitFullscreen) {
      document.exitFullscreen();
      this.isFullScreen = false;
    }
  }

  // Method fot swtiching boolean value of isProjectPage in terms of the current route
  isProjectPageSwitch(){
    if(this.router.url.includes('listing') || this.router.url.includes('project')){
      this.isProjectPage = false;
    }else{
      this.isProjectPage = true;
    }
  }


}
