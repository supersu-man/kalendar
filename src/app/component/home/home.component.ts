import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
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

  constructor(private apiService: ApiService, private router: Router, private confirmationService: ConfirmationService) { }


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
    console.log(response.credential)
    this.apiService.signin(response.credential).subscribe({
      next: (res) => {
        this.router.navigate(['/dashboard'])
      },
      error: (err: HttpErrorResponse) => {
        if(err.status == 404) {
          this.registerDialog(response.credential)
        }
      }
    })
  }

  registerDialog = (token: string) => {
    console.log("check")
    this.confirmationService.confirm({
      message: 'Register account?',
      header: 'Account not found',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true,
      },
      acceptButtonProps: {
          label: 'Register',
          severity: 'primary',
      },
      accept: () => {

        this.apiService.register(token).subscribe({
          next: (res) => {
            this.router.navigate(['/dashboard'])
          },
          error: (err) => {}
        })

      },
      reject: () => { },
    });
  }

}
