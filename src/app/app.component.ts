import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupabaseService } from './service/supabase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  title = 'Kalendar';
  constructor(private supabaseService: SupabaseService) {

    this.supabaseService.supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event == 'TOKEN_REFRESHED') {
        console.log(session?.access_token)
        localStorage.setItem('accessToken', session?.access_token as string)
      }
      if (event == 'INITIAL_SESSION' && session?.access_token) {
        console.log(session?.access_token)
        localStorage.setItem('accessToken', session?.access_token as string)
      }
    })

  }
}
