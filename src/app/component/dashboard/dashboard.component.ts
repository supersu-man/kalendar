import { DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../service/supabase.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent {

  items: any = []
  currentDate = new Date()

  constructor(private supabaseService: SupabaseService) {
    this.getMonthDates()
    console.log(this.items)
  }

  getMonthDates() {
    var daysInMonth =  new Date(this.currentDate.getFullYear(), this.currentDate.getMonth()+1, 0).getDate();
    var firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getDay();
    var weeksList = []
    for (let index = 0; index < firstDay; index++) {
      weeksList.push({ 'day': index, date: '' })
    }
    for (let index = 0; index < daysInMonth; index++) {
      var now = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), index+1)
      var day = now.getDay();
      weeksList.push({ 'day': day, date: index+1 })
    }
    this.items = weeksList
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth()+1)
    this.currentDate = new Date(this.currentDate)
    this.getMonthDates()
  }

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth()-1)
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
