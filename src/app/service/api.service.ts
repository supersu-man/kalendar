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

  getEvents = (start_date: string, end_date: string) => {
    return this.httpClient.get(environment.endpoint + '/event', { params: { start_date, end_date } })
  }

  addEvent = (body: any) => {
    return this.httpClient.post(environment.endpoint + '/event', body)
  }

  updateEvent = (body: Event) => {
    return this.httpClient.patch(environment.endpoint + '/event', { ...body })
  }
  deleteEvent = (id: string) => {
    return this.httpClient.delete(environment.endpoint + '/event', { body: { id } })
  }

  searchEvent = (query: string) => {
    return this.httpClient.get(environment.endpoint + '/event/search', { params: { query } })
  }

  getTags = () => {
    return this.httpClient.get(environment.endpoint + '/tag')
  }

  createTag = (body: Tag) => {
    return this.httpClient.post(environment.endpoint + '/tag', body)
  }

  updateTag = (body: Tag) => {
    return this.httpClient.patch(environment.endpoint + '/tag', body)
  }

  deleteTag = (id: string) => {
    return this.httpClient.delete(environment.endpoint + '/tag', { body: { id } })
  }

}
