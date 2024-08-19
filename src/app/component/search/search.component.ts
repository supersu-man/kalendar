import { Component, EventEmitter, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { EventDialogComponent } from '../../common/event-dialog/event-dialog.component';
import { Router, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CommonService } from '../../service/common.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { defaultEventForm, Event } from '../../model/event';
import { Tag } from '../../model/tag';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, EventDialogComponent, RouterModule, DatePipe, ButtonModule, InputTextModule, InputGroupModule],
  templateUrl: './search.component.html',
  styles: ``
})
export class SearchComponent implements OnInit {

  events: Event[] = []
  tags: Tag[] = []
  todayDate = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd')

  openDialog = false
  eventForm = defaultEventForm()
  searchForm = new FormGroup({
    query: new FormControl(null, [Validators.required])
  })

  constructor(private apiService: ApiService, public commonService: CommonService, private router: Router) { }

  ngOnInit(): void {
      this.getTags()
      this.search()
  }

  getTags() {
    this.apiService.getTags((tags, error) => {
      if(!error) {
        this.tags = tags
      }
    })
  }

  search = () => {
    const query = this.searchForm.getRawValue().query
    if (query) {
      this.apiService.searchEvent(query, (events, error) => {
        if(!error) {
          this.events = events
        }
      })
    }
  }
  
  today() {
    this.router.navigateByUrl(`/dashboard/calendar`)
  }

  updateEvent(event: Event) {
    this.eventForm.patchValue(event)
    this.openDialog = true
  }
  
}
