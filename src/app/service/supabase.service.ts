import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  supabaseClient = createClient(environment.url, environment.key)

  constructor(private userService: UserService) {}

  async getAccessToken() {
    let token = (await this.supabaseClient.auth.getSession()).data.session?.access_token
    return token
  }

  async signIn() {
    await this.supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
  }

  async signOut() {
    localStorage.removeItem('accessToken')
    await this.supabaseClient.auth.signOut()
    window.location.reload()
  }

}
