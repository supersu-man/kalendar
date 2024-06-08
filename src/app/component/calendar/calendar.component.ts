import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertService } from '../../service/alert.service';
import { AlertType } from '../../model/alert';

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
export class CalendarComponent implements OnInit {

  year = this.route.snapshot.paramMap.get('year') as unknown as number
  month = this.route.snapshot.paramMap.get('month') as unknown as number

  items: any = []
  todayDate = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd')

  constructor(private route: ActivatedRoute, private httpClient: HttpClient, private alertService: AlertService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.year = params['year'] as number
      this.month = params['month'] as number
      this.getMonthDates()
    })
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
    console.log(this.items)

    const sDate = `${this.year}-${this.month}-01`
    const eDate = `${this.year}-${this.month}-${daysInMonth}`
    this.getEvents(sDate, eDate)
  }

  getEvents = (date: string, eDate: string) => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    const params = { date, eDate }
    this.httpClient.get(environment.endpoint + '/event', { headers, params }).subscribe({
      next: (res: any) => {
        this.items.forEach((element: any) => element.events = res.filter((a: any) => a.date === element.fullDate));
      },
      error: (err) => {
        console.log(err)
        this.alertService.showAlert({
          message: 'Error getting events',
          type: AlertType.Error
        })
      }
    })
  }

  nextMonth() {
    const date = new Date()
    date.setFullYear(this.year)
    date.setMonth(this.month)
    this.router.navigateByUrl(`/dashboard/calendar/${new DatePipe('en-US').transform(date, 'yyyy/MM')}`)
  }

  prevMonth() {
    const date = new Date()
    date.setFullYear(this.year)
    date.setMonth(this.month-2)
    this.router.navigateByUrl(`/dashboard/calendar/${new DatePipe('en-US').transform(date, 'yyyy/MM')}`)
  }

  today() {
    const today = new Date()
    this.year = today.getFullYear()
    this.month = today.getMonth() + 1
    this.router.navigateByUrl(`/dashboard/calendar`)
  }





}
