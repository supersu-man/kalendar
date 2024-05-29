import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../service/supabase.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    RouterModule,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent {

  items: any = []
  currentDate = new Date()

  constructor(private supabaseService: SupabaseService, private httpClient: HttpClient) {
    this.getMonthDates()
  }

  getMonthDates() {
    var daysInMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
    var firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getDay();
    this.items = []
    for (let index = 0; index < firstDay; index++) {
      this.items.push({})
    }
    var theDate = this.currentDate
    for (let index = 0; index < daysInMonth; index++) {
      const offset = theDate.getTimezoneOffset()
      theDate = new Date(theDate.getTime() - (offset*60*1000))
      theDate.setDate(index+1)
      this.items.push({
        fullDate: theDate.toISOString().split('T')[0],
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

  logout() {
    this.supabaseService.signOut()
  }

}
