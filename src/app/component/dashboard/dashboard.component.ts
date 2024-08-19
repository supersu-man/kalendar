import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../service/supabase.service';
import { SettingsService } from '../../service/settings.service';
import { SidebarModule } from 'primeng/sidebar';
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    RouterModule,
    CommonModule,
    SidebarModule
  ],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent {
  constructor(private supabaseService: SupabaseService, public settingsService: SettingsService, public router: Router, public commonService: CommonService) { }

  logout = () => {
    this.supabaseService.signOut()
  }

}
