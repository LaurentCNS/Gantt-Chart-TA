import { Component, OnInit } from '@angular/core';
import { faTasks} from "@fortawesome/free-solid-svg-icons";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../class/user";
import {Userstories} from "../../class/userstories";
import {log} from "ngx-tethys/util";
import {UserstoriesService} from "../../services/userstories.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  faTasks = faTasks;
  id: number = 0;
  user?: User;
  formUserStory = new Userstories();
  newUserStory ?: Userstories;

  constructor(private activatedRoute: ActivatedRoute,
              private userStoriesService : UserstoriesService,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    // Get id of the route and lunch the function getUserStories with param id
    this.id = parseInt(<string>this.activatedRoute.snapshot.paramMap.get('id'));
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }

  addTask() {
    if (this.user) {
      this.formUserStory.project = this.id;
      this.formUserStory.is_closed = false;
      if (this.formUserStory.start_date_task > this.formUserStory.end_date_task) {
        this.toastr.error('La date de début ne peut pas être supérieure à la date de fin','ERREUR !', {positionClass: 'toast-bottom-right'});
      }
      else {
        this.userStoriesService.addUserstory(this.formUserStory).subscribe(data => {
          this.newUserStory = data;
          log(this.newUserStory);
          this.toastr.success('Nouvelle tâche créée avec succès.', 'Félicitation !', {positionClass: 'toast-bottom-right'});
          this.router.navigateByUrl('/selection/' + this.id);
        }, error => {
          this.toastr.error('La création à échouée, une erreur est servenue.', 'ERREUR !', {positionClass: 'toast-bottom-right'});
        })
      }
    }
  }
}
