import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Event } from '../model/event';
import { Tag } from '../model/tag';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  signin = (googleToken: string) => {
    return this.httpClient.post(environment.endpoint + '/user/signin', { jwtToken: googleToken })
  }

  register = (googleToken: string) => {
    return this.httpClient.post(environment.endpoint + '/user/register', { jwtToken: googleToken })
  }

  getNewToken = (oldToken: string) => {
    return this.httpClient.post(environment.endpoint + "/user/token", { accessToken: oldToken })
  }

  getEvents = (year: number, month: number, date: number, callback: (events: Event[], error: HttpErrorResponse | null) => void) => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    const params = { date: `${year}-${month}-${date}` }
    this.httpClient.get(environment.endpoint + '/event', { headers, params }).subscribe({
      next: (res) => {
        callback(res as Event[], null)
      },
      error: (err: HttpErrorResponse) => {
        callback([], err)
      }
    })
  }

  getEventsRange = (date: string, eDate: string, callback: (events: Event[], error: HttpErrorResponse | null) => void) => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    const params = { date, eDate }
    this.httpClient.get(environment.endpoint + '/event', { headers, params }).subscribe({
      next: (res) => {
        callback(res as Event[], null)
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        callback([], err)
      }
    })
  }

  deleteEvent = (id: string, callback: (event: Event | null, error: HttpErrorResponse | null) => void) => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    const body = { id }
    this.httpClient.delete(environment.endpoint + '/event', { body, headers }).subscribe({
      next: (res) => {
        callback(res as Event, null)
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        callback(null, err)
      }
    })
  }

  searchEvent = (query: string, callback: (events: Event[], error: HttpErrorResponse | null) => void) => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    const params = { query }
    this.httpClient.get(environment.endpoint + '/event/search', { headers, params }).subscribe({
      next: (res) => {
        callback(res as Event[], null)
      },
      error: (err) => {
        console.log(err)
        callback([], err)
      }
    })
  }

  addEvent = (body: Event, callback: (event: Event | null, error: HttpErrorResponse | null) => void) => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    this.httpClient.post(environment.endpoint + '/event', body, { headers }).subscribe({
      next: (res) => {
        callback(res as Event, null)
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        callback(null, err)
      }
    })
  }

  updateEvent = (body: Event, callback: (event: Event | null, error: HttpErrorResponse | null) => void) => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    this.httpClient.patch(environment.endpoint + '/event', { ...body }, { headers }).subscribe({
      next: (res) => {
        callback(res as Event, null)
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        callback(null, err)
      }
    })
  }

  getTags = (callback: (tags: Tag[], error: HttpErrorResponse | null) => void) => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    this.httpClient.get(environment.endpoint + '/tag', { headers }).subscribe({
      next: (res) => {
        callback(res as Tag[], null)
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        callback([], err)
      }
    })
  }

  createTag = (body: Tag, callback: (tag: Tag | null, error: HttpErrorResponse | null) => void) => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    this.httpClient.post(environment.endpoint + '/tag', body, { headers }).subscribe({
      next: (res) => {
        callback(res as Tag, null)
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        callback(null, err)
      }
    })
  }

  updateTag = (body: Tag, callback: (tag: Tag | null, error: HttpErrorResponse | null) => void) => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    this.httpClient.patch(environment.endpoint + '/tag', body, { headers }  ).subscribe({
      next: (res) => {
        callback(res as Tag, null)
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        callback(null, err)
      }
    })
  }

  deleteTag = (id: string, callback: (tag: Tag | null, error: HttpErrorResponse | null) => void) => {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    this.httpClient.delete(environment.endpoint + '/tag', { headers, body: { id } }).subscribe({
      next: (res) => {
        callback(res as Tag, null)
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        callback(null, err)
      }
    })
  }

}
