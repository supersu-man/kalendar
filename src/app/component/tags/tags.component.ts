import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { Tag } from '../../model/tag';
import { HeaderComponent } from '../../common/header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TagDialogComponent } from '../../common/tag-dialog/tag-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-tags',
  imports: [
    RouterModule,
    HeaderComponent,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './tags.component.html',
  styles: ``
})
export class TagsComponent implements OnInit {

  apiService = inject(ApiService)
  router = inject(Router)

  readonly dialog = inject(MatDialog);

  tags: Tag[] = []
  displayedColumns: string[] = ['name', 'color', 'actions'];

  ngOnInit(): void {
    this.getTags()
  }

  openUpdateTagDialog = (tag: Tag | null = null) => {
    const dialogRef = this.dialog.open(TagDialogComponent)
    const dialogInstance = dialogRef.componentInstance
    if (tag) dialogInstance.tagForm.setValue(tag)

    dialogInstance.onSaveClick.subscribe(_ => {
      if (tag) {
        this.updateTag(dialogRef)
      } else {
        this.createTag(dialogRef)
      }
    })

    dialogRef.afterClosed().subscribe(_ => {
      dialogRef.componentInstance.loader = false
      dialogRef.componentInstance.tagForm.reset({ color: '#000000' })
    })
  }

  openDeleteTagDialog = (id: string) => {
    const dialogRef = this.dialog.open(ConfirmDialogComponent)
    const dialogInstance = dialogRef.componentInstance
    dialogInstance.config = { heading: 'Delete Tag?', description: 'This action cannot be undone.' }

    dialogInstance.onButtonClick.subscribe(_ => {
      dialogInstance.loader = true
      this.apiService.deleteTag(id).subscribe({
        next: (res) => {
          dialogRef.close()
          this.getTags()
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

  createTag = (dialogRef: MatDialogRef<TagDialogComponent, any>) => {
    dialogRef.componentInstance.loader = true
    this.apiService.createTag(dialogRef.componentInstance.tagForm.getRawValue() as Tag).subscribe({
      next: (res) => {
        dialogRef.close()
        this.getTags()
      },
      error: (err) => {
        dialogRef.componentInstance.loader = false
        console.log(err)
      }
    })
  }

  updateTag(dialogRef: MatDialogRef<TagDialogComponent, any>) {
    dialogRef.componentInstance.loader = true
    this.apiService.updateTag(dialogRef.componentInstance.tagForm.getRawValue() as Tag).subscribe({
      next: (res) => {
        dialogRef.close()
        this.getTags()
      },
      error: (err) => {
        dialogRef.componentInstance.loader = false
        console.log(err)
      }
    })
  }

}
