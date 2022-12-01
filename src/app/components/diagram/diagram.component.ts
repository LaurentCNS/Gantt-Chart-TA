import {Component, OnInit, ViewChild, AfterViewInit, TemplateRef} from '@angular/core';
import {Userstories} from "../../class/userstories";
import {AuthService} from "../../services/auth.service";
import {UserstoriesService} from "../../services/userstories.service";
import {ActivatedRoute, Router} from "@angular/router";
import {
  faWarning,
  faLeftLong,
  faSquareMinus,
  faSquarePlus,
  faCircleInfo,
  faCircleChevronLeft,
  faCircleChevronRight,
  faTrash,
  faCalendarDay,
  faSliders,
  faFlagCheckered
} from "@fortawesome/free-solid-svg-icons";
import {
  GanttItem,
  GanttViewOptions,
  GanttBarClickEvent,
  GanttViewType,
  GanttDragEvent,
  GanttLineClickEvent,
  GanttLinkDragEvent,
  NgxGanttComponent,
  GanttSelectedEvent
} from "@worktile/gantt";
import {ThyNotifyService} from 'ngx-tethys/notify';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ItemsFilter} from "../../class/items-filter";
import {ToastrService} from "ngx-toastr";
import {UserStoryStatus} from "../../class/user-story-status";

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css']
})

export class DiagramComponent implements OnInit, AfterViewInit {

  // GLOBAL VARIABLES
  idProject: number = 0;
  isTaskPage = true;

  // GANTT CONFIG
  viewOptions: GanttViewOptions = {
    dateFormat: {
      yearQuarter: `QQQ`,
      month: `MMMM yyyy`,
      yearMonth: `LLLL yyyy'(week' w ')'`,
      quarter: `QQQ`,
      week: `w`,
      year: `yyyy`,
    }
  };
  views = [
    {
      name: 'Jour', value: GanttViewType.day
    },
    {
      name: 'Semaine', value: GanttViewType.week
    },
    {
      name: 'Mois', value: GanttViewType.month
    },
    {
      name: 'Trimestre', value: GanttViewType.quarter
    },
    {
      name: 'Année', value: GanttViewType.year
    }
  ];
  viewType: GanttViewType = GanttViewType.month;
  options = {
    viewType: GanttViewType.day
  };
  @ViewChild('gantt') diagramComponent: NgxGanttComponent | undefined
  @ViewChild('closebutton') closebutton: any;

  // COMPONENT FOR GANTT
  items: GanttItem[] = [];
  userStories ?: Userstories[];
  userStoryStatus ?: UserStoryStatus;
  tasksTemp ?: ItemsFilter[];
  itemLate: ItemsFilter[] = [];
  itemProgress: ItemsFilter[] = [];
  itemComing: ItemsFilter[] = [];
  itemNoDatesTask: ItemsFilter[] = [];
  itemFinished: ItemsFilter[] = [];
  scrollDay: Date = new Date();
  scrollWeek: Date = new Date();
  scrollMonth: Date = new Date();
  scrollQuarter: Date = new Date();
  scrollYear: Date = new Date();

  // COMPONENT FORM AND MODAL
  usFilter ?: Userstories[];
  usSelected ?: Userstories | undefined;
  idModal!: string;
  idUsStatus ?: string;
  inputRadioChange = false;
  modalTemplate2: TemplateRef<any> | undefined;

  // ICONS
  faWarning = faWarning;
  faLeftLong = faLeftLong;
  faSquareMinus = faSquareMinus;
  faSquarePlus = faSquarePlus;
  faInfo = faCircleInfo;
  faCircleChevronLeft = faCircleChevronLeft;
  faCircleChevronRight = faCircleChevronRight;
  faCalendarDay = faCalendarDay;
  faTrash = faTrash;
  faSliders = faSliders;
  faFlagCheckered = faFlagCheckered;


  // FILTERS
  isLateFilter = true;
  isInProgressFilter = true;
  isToComeFilter = true;
  isFinishedFilter = true;
  isNoDatesTask = true;
  toolBarLate = true;


  constructor(private authService: AuthService,
              private userstoryService: UserstoriesService,
              private activatedRoute: ActivatedRoute,
              private thyNotify: ThyNotifyService,
              private modalService: NgbModal,
              private router: Router,
              private toastr: ToastrService,
  ) {
  }


  ngOnInit(): void {
    // Get id of the route and lunch the function getUserStories with param id
    let id = parseInt(<string>this.activatedRoute.snapshot.paramMap.get('id'));
    this.getUserStories(id)
    this.idProject = id;
  }


  //---------------------- FUNCTION ON LOAD ----------------------//

  // Get userstories with id project
  getUserStories(id: number) {
    this.userstoryService.getAllUserstories().subscribe(data => {
      this.userStories = data.filter(userstory => userstory.project == id);
      this.setTasksTempArrays();
    })
  }

  // Convert userstories to ItemsFilter
  convertUserStoriesToTask(us: Userstories): ItemsFilter {
    return {
      id: us.id,
      title: us.subject,
      start: new Date(us.start_date_task).getTime(),
      end: new Date(us.end_date_task).getTime(),
      color: "",
      is_late: us.is_late,
      is_closed: us.is_closed,
      ref: us.ref,
    }
  }

  // Set and push item in temporary array
  setTasksTempArrays() {
    this.tasksTemp = [];
    this.userStories?.forEach(us => {
      this.tasksTemp?.push(this.convertUserStoriesToTask(us));
    });
    this.setFilter();
  }

  // Set filter and color for each item for left menu and diagram
  setFilter() {
    let dateNow = new Date().getTime();

    // Empty array for call function addOrEditUs
    this.itemLate = [];
    this.itemProgress = [];
    this.itemComing = [];
    this.itemNoDatesTask = [];

    if (this.tasksTemp) {
      for (let i = 0; i < this.tasksTemp.length; i++) {
        // format date start and end of userstory in timestamp
        let start = this.tasksTemp[i].start;
        let end = this.tasksTemp[i].end;

        // Condition for check if status is not "done"
        if (this.tasksTemp[i].is_closed === false) {
          // Condition to check if the task has no dates
          if (start == 0 && end == 0 && this.tasksTemp[i].is_late != true) {
            // set null a number of days for the task
            //remove in object the number of days
            delete this.tasksTemp[i].start;
            delete this.tasksTemp[i].end;
            this.itemNoDatesTask.push(this.tasksTemp[i]);
            this.tasksTemp[i].color = "#6c757d";
          } else {
            if (start && end) {
              // Condition to check if the task is late
              if (end < dateNow || this.tasksTemp[i].is_late == true) {
                this.itemLate.push(this.tasksTemp[i]);
                this.tasksTemp[i].color = "#c00808";
              }
              // Condition to check date task is in progress
              if (start < dateNow && end > dateNow && this.tasksTemp[i].is_late != true) {
                this.itemProgress.push(this.tasksTemp[i]);
                this.tasksTemp[i].color = "#f97225";
              }
              if (start > dateNow && this.tasksTemp[i].is_late != true) {
                this.itemComing.push(this.tasksTemp[i]);
                this.tasksTemp[i].color = "#4264b3";
              }
            }
          }
        } else {
          if (start == 0 && end == 0) {
            //remove in object the number of days
            delete this.tasksTemp[i].start;
            delete this.tasksTemp[i].end;
            this.itemFinished.push(this.tasksTemp[i]);
            this.tasksTemp[i].color = "#6c757d";
          } else {
            this.itemFinished.push(this.tasksTemp[i]);
            this.tasksTemp[i].color = "#49a557";
          }
        }
        // Push all array in gantt if the filter is true or false
        this.pushInGantt(this.itemLate, this.itemProgress, this.itemComing);
      }
    }
  }

  // Push item in gantt with filter (!because not provided by ngx-gantt)
  pushInGantt(late: ItemsFilter[], progress: ItemsFilter[], coming: ItemsFilter[]) {
    this.items = [];

    if (this.isLateFilter == true) {
      // Push in usFilter array userstories late
      this.items.push(...late);
    }
    if (this.isInProgressFilter == true) {
      // Push in usFilter array userstories in progress
      this.items.push(...progress);
    }
    if (this.isToComeFilter == true) {
      // Push in usFilter array userstories to come
      this.items.push(...coming);
    }
    if (this.isNoDatesTask == true) {
      // Push in usFilter array userstories to come
      this.items.push(...this.itemNoDatesTask);
    }
    if (this.isFinishedFilter == true) {
      // Push in usFilter array userstories to come
      this.items.push(...this.itemFinished);
    }

    this.organizeDiagram();
  }

  // Order by start date AND no dates task at the end
  organizeDiagram() {
    this.items.sort((a, b) => {
        if (a.start == 0 && b.start == 0) {
          return 0;
        }
        if (a.start == 0) {
          return 1;
        }
        if (b.start == 0) {
          return -1;
        }
        return a.start! - b.start!;
      }
    );
  }

  //---------------------- Filter functions on user click ----------------------//

  // Reorganize the diagram (ternary operator)
  filterIsLate() {
    this.isLateFilter = !this.isLateFilter;
    this.pushInGantt(this.itemLate, this.itemProgress, this.itemComing);
  }

  filterIsToCome() {
    this.isToComeFilter = !this.isToComeFilter;
    this.pushInGantt(this.itemLate, this.itemProgress, this.itemComing);
  }

  filterIsInProgress() {
    this.isInProgressFilter = !this.isInProgressFilter;
    this.pushInGantt(this.itemLate, this.itemProgress, this.itemComing);
  }

  filterIsFInish() {
    this.isFinishedFilter = !this.isFinishedFilter;
    this.pushInGantt(this.itemLate, this.itemProgress, this.itemComing);
  }

  filterIsNoDatesTask() {
    this.isNoDatesTask = !this.isNoDatesTask;
  }

  //---------------------- Navigation function on user click ----------------------//

  // Navigation
  scrollLeft() {
    if (this.viewType == 'day') {
      setTimeout(() => this.diagramComponent?.scrollToDate(this.scrollDay.getTime() - 86400000), 100);
      this.scrollDay = new Date(this.scrollDay.getTime() - 86400000);
    } else if (this.viewType == 'week') {
      setTimeout(() => this.diagramComponent?.scrollToDate(this.scrollWeek.getTime() - 604800000), 100);
      this.scrollWeek = new Date(this.scrollWeek.getTime() - 604800000);
    } else if (this.viewType == 'month') {
      setTimeout(() => this.diagramComponent?.scrollToDate(this.scrollMonth.getTime() - 2628000000), 100);
      this.scrollMonth = new Date(this.scrollMonth.getTime() - 2628000000);
    } else if (this.viewType == 'quarter') {
      setTimeout(() => this.diagramComponent?.scrollToDate(this.scrollQuarter.getTime() - 7884000000), 100);
      this.scrollQuarter = new Date(this.scrollQuarter.getTime() - 7884000000);
    } else if (this.viewType == 'year') {
      setTimeout(() => this.diagramComponent?.scrollToDate(this.scrollYear.getTime() - 31536000000), 100);
      this.scrollYear = new Date(this.scrollYear.getTime() - 31536000000);
    }
  }

  scrollToToday() {
    if (this.viewType == 'day') {
      this.scrollDay = new Date();
    } else if (this.viewType == 'week') {
      this.scrollWeek = new Date();
    } else if (this.viewType == 'month') {
      this.scrollMonth = new Date();
    } else if (this.viewType == 'quarter') {
      this.scrollQuarter = new Date();
    }
    this.diagramComponent?.scrollToToday();
  }

  scrollRight() {
    if (this.viewType == 'day') {
      setTimeout(() => this.diagramComponent?.scrollToDate(this.scrollDay.getTime() + 86400000), 100);
      this.scrollDay = new Date(this.scrollDay.getTime() + 86400000);
    } else if (this.viewType == 'week') {
      setTimeout(() => this.diagramComponent?.scrollToDate(this.scrollWeek.getTime() + 604800000), 100);
      this.scrollWeek = new Date(this.scrollWeek.getTime() + 604800000);
    } else if (this.viewType == 'month') {
      setTimeout(() => this.diagramComponent?.scrollToDate(this.scrollMonth.getTime() + 2628000000), 100);
      this.scrollMonth = new Date(this.scrollMonth.getTime() + 2628000000);
    } else if (this.viewType == 'quarter') {
      setTimeout(() => this.diagramComponent?.scrollToDate(this.scrollQuarter.getTime() + 7884000000), 100);
      this.scrollQuarter = new Date(this.scrollQuarter.getTime() + 7884000000);
    } else if (this.viewType == 'year') {
      setTimeout(() => this.diagramComponent?.scrollToDate(this.scrollYear.getTime() + 31536000000), 100);
      this.scrollYear = new Date(this.scrollYear.getTime() + 31536000000);
    }
  }

  // Cursor at load page
  ngAfterViewInit() {
    let dateNow = new Date().getTime();
    setTimeout(() => this.diagramComponent?.scrollToDate(dateNow), 0);
  }

  dateScrollAtChangeView() {
    if (this.viewType == 'day') {
      setTimeout(() => this.diagramComponent?.scrollToDate(this.scrollDay.getTime()), 0);
    } else if (this.viewType == 'week') {
      setTimeout(() => this.diagramComponent?.scrollToDate(this.scrollWeek.getTime()), 0);
    } else if (this.viewType == 'month') {
      setTimeout(() => this.diagramComponent?.scrollToDate(this.scrollMonth.getTime()), 0);
    } else if (this.viewType == 'quarter') {
      setTimeout(() => this.diagramComponent?.scrollToDate(this.scrollQuarter.getTime()), 0);
    } else if (this.viewType == 'year') {
      setTimeout(() => this.diagramComponent?.scrollToDate(this.scrollYear.getTime()), 0);
    }
  }

  //---------------------- Modal and register in DB ----------------------//

  selectedChange(event: GanttSelectedEvent, modalTemplate: TemplateRef<any>) {
    let firstValue = Object.values(event.selectedValue)[0];
    this.openModal(modalTemplate, firstValue);
  }

  // Modal to add or edit userstory
  openModal(modalTemplate: TemplateRef<any>, id?: string) {
    console.log(modalTemplate);
    this.modalService.open(modalTemplate, {fullscreen: true, modalDialogClass: 'modalDialog'});
    if (id) {
      this.idModal = id;
    }
    if (this.userStories) {
      this.usSelected = this.userStories.find(us => us.id == this.idModal);
      this.idUsStatus = this.idModal;
    }
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  // Event on click on userstory's gantt
  barClick(event: GanttBarClickEvent, modalTemplate: TemplateRef<any>) {
    this.idModal = event.item.id;
    this.openModal(modalTemplate);
  }

  // Form function
  addOrEditUs() {
    if (this.usSelected!.id) {

      // Update taskstemp array
      this.tasksTemp!.forEach(task => {
        if (task.id == this.usSelected!.id) {
          if (this.usSelected!.start_date_task > this.usSelected!.end_date_task) {
            this.toastr.error('La date de début ne peut pas être supérieure à la date de fin','ERREUR !', {positionClass: 'toast-bottom-right'});
          } else {
            if (this.usSelected!.start_date_task) {
              task.start = new Date(this.usSelected!.start_date_task).getTime();
            } else {
              task.start = 0;
            }
            if (this.usSelected!.end_date_task) {
              task.end = new Date(this.usSelected!.end_date_task).getTime();
            } else {
              task.end = 0;
            }
            task.title = this.usSelected!.subject;
            task.is_late = this.usSelected!.is_late;
            task.is_closed = this.usSelected!.is_closed;
            task.color = "";

            // Refresh tasksTemp array
            this.tasksTemp = [...this.tasksTemp!];

            // Refresh gantt
            this.setFilter();

            // Update userstory in database and refresh or error
            this.userstoryService.updateUserstory(this.usSelected!).subscribe(
              data => {
                this.refresh();
              }, error => {
                this.toastr.error('La modification à échouée, une erreur est servenue.', 'ERREUR !', {positionClass: 'toast-bottom-right'});
              }
            );
          }
        }
      });
    }
    this.closeModal();
  }

  openModalDeleteDates(modalDeleteDates: TemplateRef<any>) {
    this.modalService.open(modalDeleteDates, {fullscreen: true, modalDialogClass: 'modalDialog'});
  }

  openModalInfoLate(modalInfoLate: TemplateRef<any>) {
    this.modalService.open(modalInfoLate);
  }

  openModalFinishTask(modalFinishTask: TemplateRef<any>) {
    this.modalService.open(modalFinishTask, {fullscreen: true, modalDialogClass: 'modalDialog'});
  }

  deleteDates() {
    this.usSelected!.start_date_task = "";
    this.usSelected!.end_date_task = "";
    this.addOrEditUs();
  }

  finishTask() {
    this.usSelected!.is_closed = true;
    this.addOrEditUs();
  }

  // refresh page
  refresh() {
    window.location.reload()
  }


  // ---------------------- Not used ----------------------//
  // Gantt functions
  lineClick(event: GanttLineClickEvent) {
  }

  dragMoved(event: GanttDragEvent) {
  }

  dragEnded(event: GanttDragEvent) {
  }

  linkDragEnded(event: GanttLinkDragEvent) {
  }
}
