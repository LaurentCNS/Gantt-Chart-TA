import {Component, OnInit} from '@angular/core';
import {Projects} from "../../class/projects";
import {User} from "../../class/user";
import {ProjectsService} from "../../services/projects.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  user?: User;
  newProject?: Projects;
  formProject = new Projects();

  constructor(private projectsService: ProjectsService,
              private router: Router,
              private toastr: ToastrService) {}


  ngOnInit(): void {
    // Get user data from local storage
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    // console.log(this.user);
  }

  // Function for creating a new project
  addProject(): void {
    if (this.user) {
      this.formProject.creation_template = 2;
      this.formProject.description = this.formProject.description;
      this.formProject.is_issues_activated = false;
      this.formProject.is_backlog_activated = false;
      this.formProject.is_kanban_activated = true;
      this.formProject.is_wiki_activated = false;
      this.formProject.videoconferences = 'jitsi';
      this.formProject.videoconferences_extra_data = '';
      // add project
      this.projectsService.createProject(this.formProject).subscribe(
        data => {
          this.newProject = data;
          this.toastr.success('Nouveau projet créé avec succès.', 'Félicitation !', {positionClass: 'toast-bottom-right'});
          this.router.navigateByUrl('/listing');
        }, error => {
          this.toastr.error('La création à échouée, une erreur est servenue.', 'ERREUR !', {positionClass: 'toast-bottom-right'});
        }
      );
    }
  }
}
