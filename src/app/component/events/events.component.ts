import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { EventDialogComponent } from '../../common/event-dialog/event-dialog.component';
import { ButtonModule } from 'primeng/button';
import { CommonService } from '../../service/common.service';
import { Tag } from '../../model/tag';
import { defaultEventForm, Event } from '../../model/event';

@Component({
    selector: 'app-date',
    imports: [DatePipe, ReactiveFormsModule, RouterModule, EventDialogComponent, ButtonModule],
    templateUrl: './events.component.html',
    styles: ``
})
export class EventsComponent implements OnInit {

  date = this.route.snapshot.paramMap.get('date') as unknown as number
  month = this.route.snapshot.paramMap.get('month') as unknown as number
  year = this.route.snapshot.paramMap.get('year') as unknown as number

  eventForm = defaultEventForm()
  events: Event[] = []
  tags: Tag[] = []

  openDialog = false
  
  constructor(private apiService: ApiService, private route: ActivatedRoute, public commonService: CommonService, private router: Router) { }

  ngOnInit(): void {
    this.getEvents()
    this.getTags()
  }

  getTags = () => {
    this.apiService.getTags((tags, error) => {
      if(!error) {
        this.tags = tags
      }
    })
  }

  today = () => {
    this.router.navigateByUrl(`/dashboard/calendar`)
  }

  getEvents = () => {
    this.apiService.getEvents(this.year, this.month, this.date, (events, error) => {
      if(!error) {
        this.events = events
      }
    })
  }

  addEvent = () => {
    this.eventForm.reset()
    this.eventForm.controls.date.setValue(this.year+'-'+this.month+ '-'+this.date)
    this.openDialog = true
  }

  updateEvent = (event: Event) => {
    this.eventForm.patchValue(event)
    this.openDialog = true
  }

}
