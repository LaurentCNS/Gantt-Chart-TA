import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {ProjectsService} from "../../services/projects.service";
import {Projects} from "../../class/projects";
import { faLockOpen, faKey, faFaceSadCry} from "@fortawesome/free-solid-svg-icons";
import {Router} from "@angular/router";

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {

  projects?: Projects[];
  faLock = faLockOpen;
  faKey = faKey;
  faSad = faFaceSadCry;
  isEmpty = false;

  constructor(private authService: AuthService,
              private projectsService : ProjectsService,
              private router: Router,) { }

  ngOnInit(): void {
    // Get all projects
    this.projectsService.getAllProjects().subscribe(data => {
      this.projects = data;
      if (this.projects.length === 0) {
        this.isEmpty = true;
      }
      // Order projects by date of creation
      this.projects.sort((a, b) => {
        return <any>new Date(b.created_date) - <any>new Date(a.created_date);
      });
    }, error => {
      this.isEmpty = true;
    })
  }



}
