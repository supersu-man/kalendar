import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../service/api.service';
import { EventDialogComponent } from '../../common/event-dialog/event-dialog.component';
import { Tag } from '../../model/tag';
import { Event } from '../../model/event';
import { HeaderComponent } from "../../common/header/header.component";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-date',
  imports: [DatePipe, RouterModule, HeaderComponent, MatIconModule, MatButtonModule],
  templateUrl: './events.component.html',
  styles: ``
})
export class EventsComponent implements OnInit {

  apiService = inject(ApiService)
  activatedRoute = inject(ActivatedRoute)
  router = inject(Router)

  date = this.activatedRoute.snapshot.params['date'] as number
  month = this.activatedRoute.snapshot.params['month'] as number
  year = this.activatedRoute.snapshot.params['year'] as number

  events: Event[] = []
  tags: Tag[] = []

  readonly dialog = inject(MatDialog);


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.date = params['date']
      this.year = params['year']
      this.month = params['month']

      this.getEvents()
    })
    this.getTags()
  }

  today = () => {
    this.router.navigateByUrl(`/calendar/${new DatePipe('en-US').transform(new Date(), 'yyyy/MM/dd')}`)
  }

  getEvents = () => {
    const date = `${this.year}-${this.month}-${this.date}`
    this.apiService.getEvents(date, date).subscribe({
      next: (res: any) => {
        this.events = res
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

  nextDay = () => {
    const date = new Date(`${this.year}-${this.month}-${this.date}`)
    date.setDate(date.getDate() + 1)
    this.router.navigateByUrl(`/calendar/${new DatePipe('en-US').transform(date, 'yyyy/MM/dd')}`)
  }

  prevDay = () => {
    const date = new Date(`${this.year}-${this.month}-${this.date}`)
    date.setDate(date.getDate() - 1)
    this.router.navigateByUrl(`/calendar/${new DatePipe('en-US').transform(date, 'yyyy/MM/dd')}`)
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

  openAddEventDialog = (event: Event | null = null) => {
    const dialogRef = this.dialog.open(EventDialogComponent)
    const dialogInstance = dialogRef.componentInstance
    dialogInstance.tags = this.tags
    if (event) dialogInstance.eventForm.setValue(event)
    else dialogInstance.eventForm.reset({ date: new Date(`${this.month}-${this.date}-${this.year}`) })

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


}
