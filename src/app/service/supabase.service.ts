import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabaseClient = createClient(environment.url, environment.key)

  constructor() {
    this.supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event == 'TOKEN_REFRESHED') {
        localStorage.setItem('accessToken', session?.access_token as string)
      }
      if (event == 'INITIAL_SESSION' && session?.access_token) {
        localStorage.setItem('accessToken', session?.access_token as string)
      }
    })
  }

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
