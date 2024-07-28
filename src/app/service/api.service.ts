import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AlertService } from './alert.service';
import { AlertType } from '../model/alert';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient, private alertService: AlertService) { }

  getEvents = (year: number, month: number, date: number, callback: (events: any) => void) => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    const params = { date: `${year}-${month}-${date}` }
    this.httpClient.get(environment.endpoint + '/event', { headers, params }).subscribe({
      next: (res) => {
        callback(res)
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

  getEventsRange = (date: string, eDate: string, callback: (events: any) => void) => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    const params = { date, eDate }
    this.httpClient.get(environment.endpoint + '/event', { headers, params }).subscribe({
      next: (events: any) => {
        callback(events)
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

  deleteEvent = (id: any, callback: () => void) => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    const body = { id }
    this.httpClient.delete(environment.endpoint + '/event', { body, headers }).subscribe({
      next: (res) => {
        this.alertService.showAlert({
          message: 'Sucessfully deleted event',
          type: AlertType.Success
        })
        callback()
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

  addEvent = (body: any, year: number, month: number, date: number, callback: () => void) => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    this.httpClient.post(environment.endpoint + '/event', { ...body, date: `${year}-${month}-${date}` }, { headers }).subscribe({
      next: (res) => {
        this.alertService.showAlert({
          message: 'Sucessfully added event',
          type: AlertType.Success
        })
        callback()
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

  updateEvent = (body: any, callback: () => void) => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    this.httpClient.patch(environment.endpoint + '/event', { ...body }, { headers }).subscribe({
      next: (res) => {
        this.alertService.showAlert({
          message: 'Sucessfully updating event',
          type: AlertType.Success
        })
        callback()
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

  getTags = (callback: (tags: any) => void) => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    this.httpClient.get(environment.endpoint + '/tag', { headers }).subscribe({
      next: (res) => {
        callback(res)
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

  createTag = (body: any, callback: () => void) => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    this.httpClient.post(environment.endpoint + '/tag', body, { headers }).subscribe({
      next: (res) => {
        this.alertService.showAlert({
          message: 'Sucessfully added tag',
          type: AlertType.Success
        })
        callback()
      },
      error: (err) => {
        console.log(err)
        this.alertService.showAlert({
          message: 'Error adding tag',
          type: AlertType.Error
        })
      }
    })
  }

  updateTag = (body: any, callback: () => void) => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    this.httpClient.patch(environment.endpoint + '/tag', body, { headers }  ).subscribe({
      next: (res) => {
        this.alertService.showAlert({
          message: 'Sucessfully updated tag',
          type: AlertType.Success
        })
        callback()
      },
      error: (err) => {
        console.log(err)
        this.alertService.showAlert({
          message: 'Error updating tag',
          type: AlertType.Error
        })
      }
    })
  }


  deleteTag = (id: any, callback: () => void) => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    this.httpClient.delete(environment.endpoint + '/tag', { headers, body: { id } }).subscribe({
      next: (res) => {
        this.alertService.showAlert({
          message: 'Sucessfully deleted tag',
          type: AlertType.Success
        })
        callback()
      },
      error: (err) => {
        console.log(err)
        this.alertService.showAlert({
          message: 'Error deleting tag',
          type: AlertType.Error
        })
      }
    })
  }




}
