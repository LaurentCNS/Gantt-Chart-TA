import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {User} from "../../class/user";
import { faUserCircle, faUser, faFolder, faExpand, faDownLeftAndUpRightToCenter, faRightFromBracket, faSquarePlus, faSquareCaretLeft} from "@fortawesome/free-solid-svg-icons";
import { Location } from "@angular/common";
import {ProjectsService} from "../../services/projects.service";
import {log} from "ngx-tethys/util";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  user?: User;
  back : boolean = false;
  faUserCircle = faUserCircle;
  faUser = faUser;
  faFolder = faFolder;
  faExpand = faExpand;
  faSquarePlus = faSquarePlus;
  faMinimize = faDownLeftAndUpRightToCenter;
  faRightFromBracket = faRightFromBracket;
  faArrowLeft = faSquareCaretLeft

  // SELECTORS
  isFullScreen !: boolean;
  isProjectPage !: boolean;

  constructor(private authService: AuthService,
              private projectService: ProjectsService,
              private location : Location) {
  }

  ngOnInit(): void {
    // Get user data from local storage
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.isFullScreen = this.projectService.isFullScreen;
    this.projectService.isProjectPageSwitch();
    this.isProjectPage = this.projectService.isProjectPage;
    log(this.isProjectPage)
  }

  // Function to logout user
  logout() {
    this.authService.signOut();
  }

  // Full screen mode
  fullScreenOn(){
    this.projectService.fullScreenOn();
    this.isFullScreen = this.projectService.isFullScreen;
  }

  fullScreenOff(){
    this.projectService.fullScreenOff();
    this.isFullScreen = this.projectService.isFullScreen;
  }

  returnBack(){
    this.location.back();
  }


}
