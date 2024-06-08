import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { AlertService } from '../../service/alert.service';
import { AlertType } from '../../model/alert';

@Component({
  selector: 'app-date',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, RouterModule],
  templateUrl: './events.component.html',
  styles: ``
})
export class EventsComponent implements OnInit {

  date = this.route.snapshot.paramMap.get('date') as unknown as number
  month = this.route.snapshot.paramMap.get('month') as unknown as number
  year = this.route.snapshot.paramMap.get('year') as unknown as number

  dialog: Modal | undefined

  eventForm = new FormGroup({
    id: new FormControl(null),
    date: new FormControl(null),
    tag_id: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required])
  })

  events: any = []
  tags: any = []

  constructor(private route: ActivatedRoute, private httpClient: HttpClient, private alertService: AlertService) { }

  ngOnInit(): void {
    const element = document.getElementById('eventDialog') as Element
    this.dialog = new Modal(element, {})
    this.getEvents()
    this.getTags()
  }

  getTags() {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    this.httpClient.get(environment.endpoint + '/tag', { headers }).subscribe({
      next: (res) => {
        this.tags = res
      },
      error: (err) => {
        console.log(err)
        this.alertService.showAlert({
          message: 'Error getting tags',
          type: AlertType.Error
        })
      }
    })
  }

  getEvents = () => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    const params = { date: `${this.year}-${this.month}-${this.date}` }
    this.httpClient.get(environment.endpoint + '/event', { headers, params }).subscribe({
      next: (res) => {
        this.events = res
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

  deleteEvent() {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    const body = { id: this.eventForm.getRawValue().id }
    this.httpClient.delete(environment.endpoint + '/event', { body, headers }).subscribe({
      next: (res) => {
        this.dialog?.hide()
        this.getEvents()
        this.alertService.showAlert({
          message: 'Sucessfully deleted event',
          type: AlertType.Success
        })
      },
      error: (err) => {
        console.log(err)
        this.alertService.showAlert({
          message: 'Error deleting event',
          type: AlertType.Error
        })
      }
    })
  }

  addEvent() {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    const body = this.eventForm.getRawValue()
    this.httpClient.post(environment.endpoint + '/event', { ...body, date: `${this.year}-${this.month}-${this.date}` }, { headers }).subscribe({
      next: (res) => {
        this.getEvents()
        this.dialog?.hide()
        this.alertService.showAlert({
          message: 'Sucessfully added event',
          type: AlertType.Success
        })
      },
      error: (err) => {
        console.log(err)
        this.alertService.showAlert({
          message: 'Error adding event',
          type: AlertType.Error
        })
      }
    })
  }

  updateEvent() {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    const body = this.eventForm.getRawValue()
    this.httpClient.patch(environment.endpoint + '/event', { ...body, date: `${this.year}-${this.month}-${this.date}` }, { headers }).subscribe({
      next: (res) => {
        this.dialog?.hide()
        this.getEvents()
        this.alertService.showAlert({
          message: 'Sucessfully updating event',
          type: AlertType.Success
        })
      },
      error: (err) => {
        console.log(err)
        this.alertService.showAlert({
          message: 'Error updating event',
          type: AlertType.Error
        })
      }
    })
  }

}
