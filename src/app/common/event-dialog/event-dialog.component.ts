import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TextareaModule } from 'primeng/textarea';
import { ApiService } from '../../service/api.service';
import { MessageService } from 'primeng/api';
import { defaultEventForm, Event } from '../../model/event';
import { Tag } from '../../model/tag';
import { CalendarModule } from 'primeng/calendar';

@Component({
    selector: 'app-event-dialog',
    imports: [ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, DropdownModule, TextareaModule, CalendarModule],
    templateUrl: './event-dialog.component.html',
    styles: ``
})
export class EventDialogComponent {

  @Input() eventForm = defaultEventForm()
  @Input() tags: Tag[] = []
  @Input() visible = false
  @Output() visibleChange = new EventEmitter<boolean>()
  @Output() success = new EventEmitter();

  constructor(private apiService: ApiService, private messageService: MessageService) {}

  saveEvent = () => {
    if (this.eventForm.getRawValue().id) {
      this.updateEvent()
    } else {
      this.addEvent()
    }
  }

  updateEvent = () => {
    this.apiService.updateEvent(this.eventForm.getRawValue() as Event, (event, error) => {
      if(!error) {
        this.success.emit()
        this.visible = false
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucessfully updated event' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed updating the event' });
      }
    })
  }

  addEvent = () => {
    this.apiService.addEvent(this.eventForm.getRawValue() as Event, (event, error) => {
      if(!error) {
        this.success.emit()
        this.visible = false
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucessfully added event' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed adding the event' });
      }
    })
  }


  deleteEvent = () => {
    this.apiService.deleteEvent(this.eventForm.getRawValue().id as string, (event, error) => {
      if(!error) {
        this.success.emit()
        this.visible = false
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sucessfully deleted event' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed deleting the event' });
      }
    })
  }

}
