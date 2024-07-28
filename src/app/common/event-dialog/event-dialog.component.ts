import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-event-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './event-dialog.component.html',
  styles: ``
})
export class EventDialogComponent  implements OnInit {

  @Input() eventForm = new FormGroup({
    id: new FormControl(null),
    date: new FormControl(null),
    tag_id: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required])
  })
  @Input() tags: any = []
  @Input() openModel = new EventEmitter();
  @Input() hideModel = new EventEmitter();

  @Output() deleteEvent = new EventEmitter();
  @Output() updateEvent = new EventEmitter();
  @Output() addEvent = new EventEmitter();

  dialog: Modal | undefined

  ngOnInit() {
    const element = document.getElementById('eventDialog') as Element
    this.dialog = new Modal(element, {})

    this.openModel.subscribe(() => { this.dialog?.show() })
    this.hideModel.subscribe(() => { this.dialog?.hide() })
  }

}
