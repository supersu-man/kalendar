import { Component, EventEmitter, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { EventDialogComponent } from '../../common/event-dialog/event-dialog.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    DatePipe,
    RouterModule,
    CommonModule,
    EventDialogComponent,
    ReactiveFormsModule
  ],
  templateUrl: './calendar.component.html',
  styles: ``
})
export class CalendarComponent implements OnInit {

  year = this.route.snapshot.paramMap.get('year') as unknown as number
  month = this.route.snapshot.paramMap.get('month') as unknown as number

  items: any = []
  todayDate = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd')

  view: 'grid' | 'list' = 'grid'

  tags: any = []
  eventForm = new FormGroup({
    id: new FormControl(null),
    date: new FormControl(null),
    tag_id: new FormControl(null, [Validators.required]),
    title: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required])
  })
  settingsForm = new FormGroup({
    showTitles: new FormControl(false)
  })
  openDialog = new EventEmitter()
  hideDialog = new EventEmitter()

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.year = params['year'] as number
      this.month = params['month'] as number
      this.getMonthDates()
    })
    this.getTags()
  }

  getMonthDates() {
    var daysInMonth = new Date(this.year, this.month, 0).getDate();
    var firstDay = new Date(this.year, this.month-1, 1).getDay();
    this.items = []
    for (let index = 0; index < firstDay; index++) {
      this.items.push({})
    }
    for (let index = 0; index < daysInMonth; index++) {
      this.items.push({ fullDate: `${new DatePipe('en-US').transform(this.year+'-'+this.month+'-'+(index+1), 'yyyy-MM-dd')}` })
    }
    const sDate = `${this.year}-${this.month}-01`
    const eDate = `${this.year}-${this.month}-${daysInMonth}`
    this.apiService.getEventsRange(sDate, eDate, (events) => {
      this.items.forEach((element: any) => element.events = events.filter((a: any) => a.date === element.fullDate));
    })
  }

  nextMonth() {
    const date = new Date(`${this.year}-${this.month}-01`)
    date.setMonth(date.getMonth()+1)
    this.router.navigateByUrl(`/dashboard/calendar/${new DatePipe('en-US').transform(date, 'yyyy/MM')}`)
  }

  prevMonth() {
    const date = new Date(`${this.year}-${this.month}-01`)
    date.setMonth(date.getMonth()-1)
    this.router.navigateByUrl(`/dashboard/calendar/${new DatePipe('en-US').transform(date, 'yyyy/MM')}`)
  }

  today() {
    this.router.navigateByUrl(`/dashboard/calendar`)
  }

  getTags() {
    this.apiService.getTags((tags) => {
      this.tags = tags
    })
  }

  updateEvent() {
    this.apiService.updateEvent(this.eventForm.getRawValue(), () => {
      this.getMonthDates()
      this.hideDialog.emit()
    })
  }

  deleteEvent = () => {
    this.apiService.deleteEvent(this.eventForm.getRawValue().id, () => {
      this.getMonthDates()
      this.hideDialog.emit()
    })
  }

}
