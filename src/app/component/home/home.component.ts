import { Component, OnInit } from '@angular/core';
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
export class HomeComponent implements OnInit {

  modal: bootstrap.Modal | undefined
  isloggedIn = false

  constructor(private supabaseService: SupabaseService, private httpClient: HttpClient) {

  }

  ngOnInit(): void {
    const element = document.getElementById('registerModel') as Element
    this.modal = new bootstrap.Modal(element, {})

    this.supabaseService.getAccessToken().then((token) => {
      if (!token) return
      this.httpClient.get(environment.endpoint + '/user', { headers: { Authorization: token } }).subscribe({
        next: (value) => {
          this.isloggedIn = true
          this.modal?.hide()
        },
        error: (err: HttpErrorResponse) => {
          if (err.status == 404) this.modal?.show()
          else console.log(err)
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
        this.isloggedIn = true
        this.modal?.hide()
      },
      error: (err) => {
        console.log(err)
      }
    })
  }


}
