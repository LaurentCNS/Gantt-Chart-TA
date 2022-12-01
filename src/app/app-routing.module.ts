import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {ListingComponent} from "./components/listing/listing.component";
import {DiagramComponent} from "./components/diagram/diagram.component";
import {AuthentGuard} from "./guards/authent.guard";
import {ProjectComponent} from "./components/project/project.component";
import {SelectionComponent} from "./components/selection/selection.component";
import {TaskComponent} from "./components/task/task.component";


const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'listing', component: ListingComponent, canActivate: [AuthentGuard]},
  { path: 'diagram/:id', component: DiagramComponent, canActivate: [AuthentGuard]},
  { path: 'project', component: ProjectComponent, canActivate: [AuthentGuard]},
  { path: 'selection/:id', component: SelectionComponent, canActivate: [AuthentGuard]},
  { path: 'task/:id', component: TaskComponent, canActivate: [AuthentGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
