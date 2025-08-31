import { Component, CUSTOM_ELEMENTS_SCHEMA, NgZone, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from '../../service/api.service';

declare const google: any;

@Component({
    selector: 'app-home',
    imports: [
        RouterModule,
        ButtonModule,
        DialogModule,
        ConfirmDialogModule,
        RouterLink
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './home.component.html',
    styles: ``
})
export class HomeComponent implements OnInit {

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

  isRegisterDialogOpen = false
  responseToken = ''

  constructor(private apiService: ApiService, private router: Router, private ngZone: NgZone) { }


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
        this.router.navigate(['/dashboard/calendar'])
      },
      error: (err: HttpErrorResponse) => {
        if(err.status == 404) {
          this.responseToken = response.credential
          this.ngZone.run(() => {
            
            this.isRegisterDialogOpen = true
          });

        }
      }
    })
  }

  registerAccount = () => {
    this.apiService.register(this.responseToken).subscribe({
      next: (res) => {
        this.isRegisterDialogOpen = false
        this.router.navigate(['/dashboard/calendar'])
      },
      error: (err) => {
        this.isRegisterDialogOpen = false
      }
    })
  }

}
