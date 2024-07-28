import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { EventDialogComponent } from '../../common/event-dialog/event-dialog.component';

@Component({
  selector: 'app-date',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, RouterModule, EventDialogComponent],
  templateUrl: './events.component.html',
  styles: ``
})
export class EventsComponent implements OnInit {

  date = this.route.snapshot.paramMap.get('date') as unknown as number
  month = this.route.snapshot.paramMap.get('month') as unknown as number
  year = this.route.snapshot.paramMap.get('year') as unknown as number

  eventForm = new FormGroup({
    id: new FormControl(null),
    date: new FormControl(null),
    tag_id: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required])
  })

  events: any = []
  tags: any = []

  openDialog = new EventEmitter()
  hideDialog = new EventEmitter()

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getEvents()
    this.getTags()
  }

  getTags() {
    this.apiService.getTags((tags) => {
      this.tags = tags
    })
  }

  getEvents = () => {
    this.apiService.getEvents(this.year, this.month, this.date, (events) => {
      this.events = events
    })
  }

  deleteEvent = () => {
    this.apiService.deleteEvent(this.eventForm.getRawValue().id, () => {
      this.getEvents()
      this.hideDialog.emit()
    })
  }

  addEvent() {
    this.apiService.addEvent(this.eventForm.getRawValue(), this.year, this.month, this.date, () => {
      this.getEvents()
      this.hideDialog.emit()
    })
  }

  updateEvent() {
    this.apiService.updateEvent(this.eventForm.getRawValue(), () => {
      this.getEvents()
      this.hideDialog.emit()
    })
  }

}
