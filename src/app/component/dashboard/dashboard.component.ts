import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SettingsService } from '../../service/settings.service';
import { SidebarModule } from 'primeng/sidebar';
import { CommonService } from '../../service/common.service';

@Component({
    selector: 'app-dashboard',
    imports: [
        RouterModule,
        CommonModule,
        SidebarModule
    ],
    templateUrl: './dashboard.component.html',
    styles: ``
})
export class DashboardComponent {

  constructor(public settingsService: SettingsService, public router: Router, public commonService: CommonService) { }

  logout = () => {
    
  }

}
