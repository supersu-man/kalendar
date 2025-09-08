import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { ReactiveFormsModule } from '@angular/forms';
import { defaultEventForm, Event } from '../../model/event';
import { Tag } from '../../model/tag';
import { HeaderComponent } from "../../common/header/header.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { EventDialogComponent } from '../../common/event-dialog/event-dialog.component';

@Component({
  selector: 'app-calendar',
  imports: [
    MatButtonModule,
    DatePipe,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    MatIconModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './calendar.component.html',
  styles: ``
})
export class CalendarComponent implements OnInit {

  activatedRoute = inject(ActivatedRoute)
  apiService = inject(ApiService)
  router = inject(Router)

  year = this.activatedRoute.snapshot.params['year']
  month = this.activatedRoute.snapshot.params['month']
  todayDate = new Date()

  days: any[] = []
  tags: Tag[] = []

  readonly dialog = inject(MatDialog);
  isNoEventsThisMonth = true

  weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.year = params['year']
      this.month = params['month']

      this.getMonthDates(this.month, this.year)
      this.getTags()
    })
  }

  getMonthDates = (month: number, year: number) => {
    const days: any[] = [];
    const firstDay = new Date(year, month - 1, 1).getDay();
    const totalDays = new Date(year, month, 0).getDate();

    const start_date = `${this.year}-${month}-01`
    const end_date = `${this.year}-${this.month}-${totalDays}`

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push({ date: new Date(year, month - 1, i), events: [] });
    }

    this.days = days

    const groupedEvents: any = {}
    this.apiService.getEvents(start_date, end_date).subscribe({
      next: (res: any) => {
        // Group event based on days
        for (let index = 0; index < res.length; index++) {
          const element = res[index];
          if(groupedEvents[element.date]) groupedEvents[element.date].push(element)
          else groupedEvents[element.date] = [element]
        }

        for (let index = 0; index < days.length; index++) {
          const element = days[index];
          if(!element) continue
          const formattedDate = new DatePipe('en-US').transform(element.date, 'yyyy-MM-dd') || ''
          if(groupedEvents[formattedDate]) element.events = groupedEvents[formattedDate]
        }

        this.days = days 

        console.log(this.days)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  nextMonth() {
    const date = new Date(`${this.year}-${this.month}-01`)
    date.setMonth(date.getMonth() + 1)
    this.router.navigateByUrl(`/calendar/${new DatePipe('en-US').transform(date, 'yyyy/MM')}`)
  }

  prevMonth() {
    const date = new Date(`${this.year}-${this.month}-01`)
    date.setMonth(date.getMonth() - 1)
    this.router.navigateByUrl(`/calendar/${new DatePipe('en-US').transform(date, 'yyyy/MM')}`)
  }

  today = () => {
    this.router.navigateByUrl(`/calendar/${new DatePipe('en-US').transform(new Date(), 'yyyy/MM')}`)
  }

  openAddEventDialog = () => {
    const dialogRef = this.dialog.open(EventDialogComponent)
    const dialogInstance = dialogRef.componentInstance
    dialogInstance.tags = this.tags

    dialogInstance.onSaveClick.subscribe(_ => {
      const payload = dialogInstance.eventForm.getRawValue()
      payload.date = new DatePipe('en-US').transform(payload.date, 'yyyy-MM-dd')
      dialogInstance.loader = true
      this.apiService.addEvent(payload).subscribe({
        next: (res) => {
          dialogRef.close()
          this.getMonthDates(this.month, this.year)
        },
        error: (err) => {
          dialogInstance.loader = false
        }
      })
    })

    dialogRef.afterClosed().subscribe(_ => {
      dialogRef.componentInstance.loader = false
      dialogInstance.tags = []
      dialogRef.componentInstance.eventForm.reset()
    })
  }


  getTags = () => {
    this.apiService.getTags().subscribe({
      next: (res: any) => {
        console.log(res)
        this.tags = res
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

}
