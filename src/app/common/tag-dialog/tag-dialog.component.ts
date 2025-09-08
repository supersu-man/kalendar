import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-tag-dialog',
  imports: [MatButtonModule, MatDialogModule, MatProgressSpinnerModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './tag-dialog.component.html',
  styles: ``
})
export class TagDialogComponent {

  @Output() onSaveClick = new EventEmitter()
  loader = false
  
  tagForm = new FormGroup({
    id: new FormControl(null as string | null),
    name: new FormControl(null as string | null, [Validators.required]),
    color: new FormControl('#000000' as string | null, [Validators.required])
  })
}
