import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../service/supabase.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    RouterModule,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent {

  constructor(private supabaseService: SupabaseService,) { }

  logout = () => {
    this.supabaseService.signOut()
  }

}
