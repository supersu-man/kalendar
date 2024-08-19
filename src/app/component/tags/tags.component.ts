import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { ButtonModule } from 'primeng/button';
import { CommonService } from '../../service/common.service';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { defaultTagForm, Tag } from '../../model/tag';


@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, ButtonModule, ColorPickerModule, DialogModule, InputTextModule],
  templateUrl: './tags.component.html',
  styles: ``
})
export class TagsComponent implements OnInit {

  tags: Tag[] = []
  tagForm = defaultTagForm()
  tagDialogVisible = false

  constructor(private apiService: ApiService, public commonService: CommonService, private router: Router, private messageService: MessageService) {}

  ngOnInit(): void {
    this.getTags()
  }
  getTags = () => {
    this.apiService.getTags((tags) => {
      this.tags = tags
    })
  }

  today() {
    this.router.navigateByUrl(`/dashboard/calendar`)
  }

  createTag = () => {
    this.apiService.createTag(this.tagForm.getRawValue() as Tag, (tag, error) => {
      if(!error) {
        this.getTags()
        this.tagDialogVisible = false
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucessfully created tag' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed creating the tag' });
      }
    })
  }

  saveTag = () => {
    if(this.tagForm.getRawValue().id) {
      this.updateTag()
    } else {
      this.createTag()
    }
  }

  updateTag() {
    this.apiService.updateTag(this.tagForm.getRawValue() as Tag, (tag, error) => {
      if(!error) {
        this.getTags()
        this.tagDialogVisible = false
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucessfully updated tag' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed updating the tag' });
      }
    })
  }

  deleteTag() {
    this.apiService.deleteTag(this.tagForm.getRawValue().id as string, (tag, error) => {
      if(!error) {
        this.getTags()
        this.tagDialogVisible = false
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucessfully deleted tag' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed deleting the tag' });
      }
    })
  }

}
