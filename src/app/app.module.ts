import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { ListingComponent } from './components/listing/listing.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { LoginComponent } from './components/login/login.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from 'ngx-toastr';
import { NavigationComponent } from './components/navigation/navigation.component';
import { DiagramComponent } from './components/diagram/diagram.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { NgxGanttModule } from '@worktile/gantt';
import { ProjectComponent } from './components/project/project.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { KonvaModule } from "ng2-konva";
import { ThyLayoutModule } from 'ngx-tethys/layout';
import { ThyNavModule } from 'ngx-tethys/nav';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyCheckboxModule } from 'ngx-tethys/checkbox';
import { ThySwitchModule } from 'ngx-tethys/switch';
import { ThyNotifyModule } from 'ngx-tethys/notify';
import { ThyDatePickerModule } from 'ngx-tethys/date-picker';
import { MatDialogModule} from "@angular/material/dialog";
import {MatMenuModule} from "@angular/material/menu";
import {DragDropModule} from "@angular/cdk/drag-drop";
import { SelectionComponent } from './components/selection/selection.component';
import { TaskComponent } from './components/task/task.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ListingComponent,
    LoginComponent,
    NavigationComponent,
    DiagramComponent,
    ProjectComponent,
    SelectionComponent,
    TaskComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        FormsModule,
        HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatProgressBarModule,
        MatDialogModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        FontAwesomeModule,
        ToastrModule.forRoot(),
        NgxGanttModule,
        MatSlideToggleModule,
        KonvaModule,
        ThyButtonModule,
        ThyNavModule,
        ThyLayoutModule,
        ThyCheckboxModule,
        ThyNotifyModule,
        ThySwitchModule,
        ThyDatePickerModule,
        MatMenuModule,
        DragDropModule

    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
