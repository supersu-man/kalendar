import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../service/api.service';

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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    const element = document.getElementById('tagDialog') as Element
    this.dialog = new Modal(element, {})
    this.getTags()
  }

  getTags = () => {
    this.apiService.getTags((tags) => {
      this.tags = tags
    })
  }

  createTag() {
    this.apiService.createTag(this.tag_form.getRawValue(), () => {
      this.getTags()
      this.dialog?.hide()
    })
  }

  updateTag() {
    this.apiService.updateTag(this.tag_form.getRawValue(), () => {
      this.getTags()
      this.dialog?.hide()
    })
  }

  deleteTag() {
    this.apiService.deleteTag(this.tag_form.getRawValue().id, () => {
      this.getTags()
      this.dialog?.hide()
    })
  }

}
