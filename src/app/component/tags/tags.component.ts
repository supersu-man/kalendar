import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserService } from '../../service/user.service';
import { Modal } from 'bootstrap';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertService } from '../../service/alert.service';
import { AlertType } from '../../model/alert';

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
    color: new FormControl('#000000', [Validators.required])
  })

  constructor(private httpClient: HttpClient, private alertService: AlertService) {}

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

  createTag() {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    this.httpClient.post(environment.endpoint + '/tag', this.tag_form.getRawValue(), { headers }).subscribe({
      next: (res) => {
        this.getTags()
        this.dialog?.hide()
        this.alertService.showAlert({
          message: 'Sucessfully added tag',
          type: AlertType.Success
        })
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

  updateTag() {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    this.httpClient.patch(environment.endpoint + '/tag', { ...this.tag_form.getRawValue() }, { headers }  ).subscribe({
      next: (res) => {
        this.getTags()
        this.dialog?.hide()
        this.alertService.showAlert({
          message: 'Sucessfully updated tag',
          type: AlertType.Success
        })
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

  deleteTag() {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    this.httpClient.delete(environment.endpoint + '/tag', { headers, body: { id: this.tag_form.getRawValue().id } }).subscribe({
      next: (res) => {
        this.getTags()
        this.dialog?.hide()
        this.alertService.showAlert({
          message: 'Sucessfully deleted tag',
          type: AlertType.Success
        })
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
