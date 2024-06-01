import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { authGuard } from './guard/auth.guard';
import { TagsComponent } from './component/tags/tags.component';
import { EventsComponent } from './component/events/events.component';
import { CalendarComponent } from './component/calendar/calendar.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [authGuard] },
    {
        path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], children: [
            { path: 'calendar', component: CalendarComponent },
            { path: 'calendar/:date', component: EventsComponent },
            { path: 'tags', component: TagsComponent }
        ]
    },
];
