import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-date',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './events.component.html',
  styles: ``
})
export class EventsComponent implements OnInit {

  date = this.route.snapshot.paramMap.get('date') as string
  dateObj = new Date(this.date)

  dialog: Modal | undefined

  eventForm = new FormGroup({
    id: new FormControl(null),
    date: new FormControl(null),
    tag_id: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required])
  })

  events: any = []
  tags: any = []

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) { }

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
      }
    })
  }

  getEvents = () => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    const params = { date: this.date }
    this.httpClient.get(environment.endpoint + '/event', { headers, params }).subscribe({
      next: (res) => {
        this.events = res
      },
      error: (err) => {
        console.log(err)
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
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  addEvent() {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    const body = this.eventForm.getRawValue()
    this.httpClient.post(environment.endpoint + '/event', { ...body, date: this.date }, { headers }).subscribe({
      next: (res) => {
        this.getEvents()
        this.dialog?.hide()
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  updateEvent() {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    const body = this.eventForm.getRawValue()
    this.httpClient.patch(environment.endpoint + '/event', { ...body, date: this.date }, { headers }).subscribe({
      next: (res) => {
        this.dialog?.hide()
        this.getEvents()
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

}
