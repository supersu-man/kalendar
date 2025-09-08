import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Event } from '../../model/event';
import { Tag } from '../../model/tag';

@Component({
    selector: 'app-search',
    imports: [ReactiveFormsModule, RouterModule],
    templateUrl: './search.component.html',
    styles: ``
})
export class SearchComponent implements OnInit {

  events: Event[] = []
  tags: Tag[] = []
  todayDate = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd')

  openDialog = false
  eventForm : any
  searchForm = new FormGroup({
    query: new FormControl(null, [Validators.required])
  })

  apiService = inject(ApiService)
  router = inject(Router)

  ngOnInit(): void {
      this.getTags()
  }

  getTags() {
    // this.apiService.getTags((tags, error) => {
    //   if(!error) {
    //     this.tags = tags
    //   }
    // })
  }

  
  
  today() {
    this.router.navigateByUrl(`/calendar`)
  }

  updateEvent(event: Event) {
    this.eventForm.patchValue(event)
    this.openDialog = true
  }
  
}
