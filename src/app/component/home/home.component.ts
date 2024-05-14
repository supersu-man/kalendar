import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../service/supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {

  isloggedIn = false

  constructor(private supabaseService: SupabaseService) {
    supabaseService.getAccessToken().then((token) => {
      console.log(token)
      if(token) this.isloggedIn=true
    })
  }

  login() {
    this.supabaseService.signIn()
  }

}
