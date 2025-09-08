import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tag } from '../../model/tag';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-event-dialog',
  imports: [
    MatButtonModule, 
    MatDialogModule, 
    MatProgressSpinnerModule, 
    ReactiveFormsModule, 
    MatInputModule, 
    MatDatepickerModule,
    MatSelectModule
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  templateUrl: './event-dialog.component.html',
  styles: ``
})
export class EventDialogComponent {

  @Output() onSaveClick = new EventEmitter()
  loader = false

  eventForm = new FormGroup({
    id: new FormControl(null as string | null),
    date: new FormControl(null as string | Date | null, [Validators.required]),
    tag_id: new FormControl(null as string | null, [Validators.required]),
    title: new FormControl(null as string | null, [Validators.required]),
    description: new FormControl(null as string | null, [Validators.required])
  })
  tags: Tag[] = []

}
