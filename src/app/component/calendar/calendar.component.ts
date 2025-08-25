import { Component, EventEmitter, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { ReactiveFormsModule } from '@angular/forms';
import { EventDialogComponent } from '../../common/event-dialog/event-dialog.component';
import { SettingsService } from '../../service/settings.service';
import { CommonService } from '../../service/common.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { defaultEventForm, Event } from '../../model/event';
import { Tag } from '../../model/tag';

@Component({
    selector: 'app-calendar',
    imports: [
        DatePipe,
        RouterModule,
        CommonModule,
        EventDialogComponent,
        ReactiveFormsModule,
        ButtonModule,
        CardModule,
        BadgeModule
    ],
    templateUrl: './calendar.component.html',
    styles: ``
})
export class CalendarComponent implements OnInit {

  year = this.route.snapshot.paramMap.get('year') as unknown as number
  month = this.route.snapshot.paramMap.get('month') as unknown as number

  items: {fullDate: string, events: Event[]}[] = []
  todayDate = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd')

  tags: Tag[] = []
  eventForm = defaultEventForm()
  openDialog = false
  isNoEventsThisMonth = true

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService, public settings: SettingsService, public commonService: CommonService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.year = params['year'] as number
      this.month = params['month'] as number
      this.getMonthDates()
    })
    this.getTags()
  }

  getMonthDates() {
    this.isNoEventsThisMonth = true
    var daysInMonth = new Date(this.year, this.month, 0).getDate();
    var firstDay = new Date(this.year, this.month-1, 1).getDay();
    this.items = []
    for (let index = 0; index < firstDay; index++) {
      this.items.push({ fullDate: '', events: []})
    }
    for (let index = 0; index < daysInMonth; index++) {
      this.items.push({ fullDate: `${new DatePipe('en-US').transform(this.year+'-'+this.month+'-'+(index+1), 'yyyy-MM-dd')}`, events: [] })
    }
    const sDate = `${this.year}-${this.month}-01`
    const eDate = `${this.year}-${this.month}-${daysInMonth}`
    this.apiService.getEventsRange(sDate, eDate, (events) => {
      this.items.forEach((element) => element.events = events.filter((a) => a.date === element.fullDate));
      this.items.forEach((item) => {
        if(item.events.length>0) this.isNoEventsThisMonth = false
      })
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

  today = () => {
    this.router.navigateByUrl(`/dashboard/calendar`)
  }

  getTags = () => {
    this.apiService.getTags((tags, error) => {
      if(!error) {
        this.tags = tags
      }
    })
  }

  openUpdateEventDialog = (event: Event ) => {
    this.eventForm.patchValue(event)
    this.openDialog = true
  }

  openAddEventDialog = () => {
    this.eventForm.reset()
    this.openDialog = true
  }

}
