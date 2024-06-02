import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    DatePipe,
    RouterModule,
    CommonModule
  ],
  templateUrl: './calendar.component.html',
  styles: ``
})
export class CalendarComponent {

  items: any = []
  currentDate = new Date()
  todayDate = new Date()

  constructor(private httpClient: HttpClient) {
    this.getMonthDates()
  }

  getMonthDates() {
    var daysInMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
    var firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getDay();
    this.items = []
    for (let index = 0; index < firstDay; index++) {
      this.items.push({})
    }
    for (let index = 0; index < daysInMonth; index++) {
      this.items.push({
        fullDate: this.currentDate.getFullYear()+'-'+(this.currentDate.getMonth()+1)+'-'+(index+1),
        date: index + 1
      })
    }

    const sDate = `${this.currentDate.getFullYear()}-${this.currentDate.getMonth() + 1}-1`
    const eDate = `${this.currentDate.getFullYear()}-${this.currentDate.getMonth() + 1}-${daysInMonth}`
    this.getEvents(sDate, eDate)
  }

  getEvents = (date: string, eDate: string) => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    const params = { date, eDate }
    this.httpClient.get(environment.endpoint + '/event', { headers, params }).subscribe({
      next: (res: any) => {
        this.items.forEach((element: any) => element.events = res.filter((a:any) => a.date === element.fullDate));
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1)
    this.currentDate = new Date(this.currentDate)
    this.getMonthDates()
  }

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1)
    this.currentDate = new Date(this.currentDate)
    this.getMonthDates()
  }

  today() {
    this.currentDate = new Date()
    this.getMonthDates()
  }

}
