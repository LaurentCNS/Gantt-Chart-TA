import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { faSquare} from "@fortawesome/free-solid-svg-icons";
import {ProjectsService} from "../../services/projects.service";

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent implements OnInit {
  id: number = 0;


  constructor(private activatedRoute: ActivatedRoute,
              private projectService: ProjectsService,) { }

  ngOnInit(): void {
    // Get id of the route and lunch the function getUserStories with param id
    this.id = parseInt(<string>this.activatedRoute.snapshot.paramMap.get('id'));
  }


}
