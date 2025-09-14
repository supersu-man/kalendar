import { Component, inject, NgZone, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';

declare const google: any;

@Component({
  selector: 'app-home',
  imports: [
    RouterModule,
    RouterLink,
    MatButtonModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatDialogModule
  ],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent implements OnInit {

  apiService = inject(ApiService)
  router = inject(Router)
  ngZone = inject(NgZone)

  readonly dialog = inject(MatDialog);

  coreFeatures = [
    {
      icon: "edit_calendar",
      title: "Event Management",
      description: "Easily add, edit, and categorize your events. Keep your schedule organized and accessible."
    },
    {
      icon: "task_alt",
      title: "Event Statistics",
      description: "Get insights into your event history and habits with detailed statistics and reports."
    },
    {
      icon: "search_insights",
      title: "Powerful Search",
      description: "Quickly find past or future events with a robust and intuitive search function."
    },
    {
      icon: "cloud_sync",
      title: "Cross-device Sync",
      description: "Access your calendar on any device. Your data is always synced and up-to-date."
    }
  ]

  goToGithub = () => {
    window.location.href = "https://github.com/supersu-man/kalendar"
  }

  ngOnInit(): void {
    this.initializeGoogleSignIn();
  }

  initializeGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: '840522806158-sc7iiia4faejd7b3ir80jtn6dcv3u8s5.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this)
    });

    google.accounts.id.renderButton(
      document.getElementById("googleLoginButton"),
      { size: "large", text: "signin" }
    );
  }

  handleCredentialResponse(response: any) {
    this.apiService.signin(response.credential).subscribe({
      next: (res) => {
         this.ngZone.run(() => { this.router.navigateByUrl('/calendar') })
      },
      error: (err: HttpErrorResponse) => {
        if (err.status == 404) {
          this.showRegisterDialog(response.credential)
        }
      }
    })
  }

  showRegisterDialog = (token: string) => {
    const dialogRef = this.dialog.open(ConfirmDialogComponent)
    const dialogInstance = dialogRef.componentInstance
    dialogInstance.config = { heading: 'Register account?', description: 'Account with this email doesnt exist.'}

    dialogInstance.onButtonClick.subscribe(_ => {
      dialogInstance.loader = true
      this.apiService.register(token).subscribe({
        next: (res) => {
          dialogRef.close()
          this.router.navigate(['/calendar'])
        },
        error: (err) => {
          dialogRef.close()
        }
      })
    })

    dialogRef.afterClosed().subscribe(_ => {
      dialogInstance.loader = false
      dialogInstance.config = { heading: '', description: '' }
    })
  }

}
