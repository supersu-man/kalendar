import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../service/supabase.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    ButtonModule,
    DialogModule
  ],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent implements OnInit {

  isloggedIn = false
  registerDialogVisible = false

  constructor(private supabaseService: SupabaseService, private httpClient: HttpClient, private messageService: MessageService) { }

  ngOnInit(): void {

    this.supabaseService.getAccessToken().then((token) => {
      if (!token) return
      this.httpClient.get(environment.endpoint + '/user', { headers: { Authorization: token } }).subscribe({
        next: (value) => {
          this.isloggedIn = true
          this.registerDialogVisible = false
        },
        error: (err: HttpErrorResponse) => {
          if (err.status == 404) this.registerDialogVisible = true
          else {
            console.log(err)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error getting user' });
          }
        }
      })
    })

  }

  async login() {
    await this.supabaseService.signIn()
  }

  logout() {
    this.supabaseService.signOut()
  }

  registerAccount() {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    this.httpClient.post(environment.endpoint + '/user', {}, { headers }).subscribe({
      next: (value) => {
        this.isloggedIn = true
        this.registerDialogVisible = false
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registered account successfully' });
      },
      error: (err) => {
        console.log(err)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error registering user' });
      }
    })
  }


}
