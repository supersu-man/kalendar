import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserService } from '../../service/user.service';
import { Modal } from 'bootstrap';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './tags.component.html',
  styles: ``
})
export class TagsComponent implements OnInit {

  tags: any = []

  dialog: Modal | undefined

  tag_form = new FormGroup({
    id: new FormControl(null),
    name: new FormControl(null, [Validators.required]),
    color: new FormControl(null, [Validators.required])
  })

  constructor(private userService: UserService, private httpClient: HttpClient) {}

  ngOnInit(): void {
    const element = document.getElementById('tagDialog') as Element
    this.dialog = new Modal(element, {})
    this.getTags()
  }

  getTags() {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    this.httpClient.get(environment.endpoint + '/tag', { headers }).subscribe({
      next: (res) => {
        this.tags = res
        console.log(res)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  createTag() {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    this.httpClient.post(environment.endpoint + '/tag', this.tag_form.getRawValue(), { headers }).subscribe({
      next: (res) => {
        this.getTags()
        this.dialog?.hide()
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  updateTag() {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    this.httpClient.patch(environment.endpoint + '/tag', { ...this.tag_form.getRawValue() }, { headers }  ).subscribe({
      next: (res) => {
        this.getTags()
        this.dialog?.hide()
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  deleteTag() {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    this.httpClient.delete(environment.endpoint + '/tag', { headers, body: { id: this.tag_form.getRawValue().id } }).subscribe({
      next: (res) => {
        this.getTags()
        this.dialog?.hide()
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

}
