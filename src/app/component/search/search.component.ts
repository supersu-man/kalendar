import { Component, EventEmitter, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { EventDialogComponent } from '../../common/event-dialog/event-dialog.component';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, EventDialogComponent, RouterModule, DatePipe],
  templateUrl: './search.component.html',
  styles: ``
})
export class SearchComponent implements OnInit {

  events: any = []
  tags: any = []
  todayDate = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd')


  openDialog = new EventEmitter()
  hideDialog = new EventEmitter()
  
  eventForm = new FormGroup({
    id: new FormControl(null),
    date: new FormControl(null),
    tag_id: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required])
  })

  searchForm = new FormGroup({
    query: new FormControl(null, [Validators.required])
  })

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
      this.getTags()
      this.search()
  }

  getTags() {
    this.apiService.getTags((tags) => {
      this.tags = tags
    })
  }

  search = () => {
    const query = this.searchForm.getRawValue().query
    if (query) {
      this.apiService.searchEvent(query, (events) => {
        this.events = events
      })
    }
  }

  updateEvent() {
    this.apiService.updateEvent(this.eventForm.getRawValue(), () => {
      this.search()
      this.hideDialog.emit()
    })
  }

  deleteEvent = () => {
    this.apiService.deleteEvent(this.eventForm.getRawValue().id, () => {
      this.search()
      this.hideDialog.emit()
    })
  }
  
  

}
