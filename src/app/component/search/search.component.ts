import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Event } from '../../model/event';
import { Tag } from '../../model/tag';
import { HeaderComponent } from "../../common/header/header.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EventDialogComponent } from '../../common/event-dialog/event-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule, RouterModule, HeaderComponent, MatIconModule, MatButtonModule, DatePipe, MatInputModule],
  templateUrl: './search.component.html',
  styles: ``
})
export class SearchComponent implements OnInit {

  events: Event[] = []
  tags: Tag[] = []

  query = new FormControl('')

  apiService = inject(ApiService)
  router = inject(Router)

  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.getEvents()
    this.getTags()
    this.query.valueChanges.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(searchValue => {
      this.getEvents(searchValue || '')
    });
  }

  openAddEventDialog = (event: Event | null = null) => {
    const dialogRef = this.dialog.open(EventDialogComponent)
    const dialogInstance = dialogRef.componentInstance
    dialogInstance.tags = this.tags
    if (event) {
      dialogInstance.eventForm.patchValue(event)
    }

    dialogInstance.onSaveClick.subscribe(_ => {
      const payload = dialogInstance.eventForm.getRawValue()
      payload.date = new DatePipe('en-US').transform(payload.date, 'yyyy-MM-dd')
      if (event) {
        this.updateEvent(dialogRef, payload as any)
      } else {
        this.addEvent(dialogRef, payload as any)
      }
    })

    dialogRef.afterClosed().subscribe(_ => {
      dialogRef.componentInstance.loader = false
      dialogInstance.tags = []
      dialogRef.componentInstance.eventForm.reset()
    })
  }

  openDeleteTagDialog = (id: string) => {
    const dialogRef = this.dialog.open(ConfirmDialogComponent)
    const dialogInstance = dialogRef.componentInstance
    dialogInstance.config = { heading: 'Delete Event?', description: 'This action cannot be undone.' }

    dialogInstance.onButtonClick.subscribe(_ => {
      dialogInstance.loader = true
      this.apiService.deleteTag(id).subscribe({
        next: (res) => {
          dialogRef.close()
          this.getEvents()
        },
        error: (err) => {
          dialogInstance.loader = false
          console.log(err)
        }
      })
    })

    dialogRef.afterClosed().subscribe(_ => {
      dialogInstance.loader = false
      dialogInstance.config = { heading: '', description: '' }
    })
  }

  addEvent = (dialogRef: MatDialogRef<EventDialogComponent, any>, payload: Event) => {
    dialogRef.componentInstance.loader = true
    this.apiService.addEvent(payload).subscribe({
      next: (res) => {
        this.getEvents()
        dialogRef.close()
      },
      error: (err) => {
        dialogRef.componentInstance.loader = false
      }
    })
  }

  updateEvent = (dialogRef: MatDialogRef<EventDialogComponent, any>, payload: Event) => {
    dialogRef.componentInstance.loader = true
    this.apiService.updateEvent(payload).subscribe({
      next: (res) => {
        this.getEvents()
        dialogRef.close()
      },
      error: (err) => {
        dialogRef.componentInstance.loader = false
      }
    })
  }

  getEvents = (query: string = '') => {
    this.apiService.searchEvent(query).subscribe({
      next: (res: any) => {
        this.events = res
        console.log(res)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  getTags = () => {
    this.apiService.getTags().subscribe({
      next: (res: any) => {
        console.log(res)
        this.tags = res
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

}
