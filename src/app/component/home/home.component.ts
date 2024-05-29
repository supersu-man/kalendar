import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../service/supabase.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {

  isloggedIn = false

  constructor(private supabaseService: SupabaseService, private httpClient: HttpClient) {
    this.supabaseService.getAccessToken().then((token) => {
      if (!token) return

      httpClient.get(environment.endpoint + '/user', { headers: { Authorization: token } }).subscribe({
        next: (value) => {
          this.isloggedIn = true
        },
        error: (err: HttpErrorResponse) => {
          console.log(err)
          if (err.status == 404) {
            const element = document.getElementById('registerModel') as Element
            new bootstrap.Modal(element, {}).show()
          }
        }
      })

    })
  }

  login() {
    this.supabaseService.signIn()
  }

  logout() {
    this.supabaseService.signOut()
  }

  registerAccount() {
    const token = localStorage.getItem('accessToken') as string
    const headers = { Authorization: token }
    this.httpClient.post(environment.endpoint + '/user', {}, { headers }).subscribe({
      next: (value) => {
        console.log(value)
        this.isloggedIn = true
        const element = document.getElementById('registerModel') as Element
        new bootstrap.Modal(element, {}).show()
      },
      error: (err) => {
        console.log(err)
      }
    })
  }


}
