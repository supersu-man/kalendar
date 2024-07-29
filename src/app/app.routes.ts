import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { authGuard } from './guard/auth.guard';
import { TagsComponent } from './component/tags/tags.component';
import { EventsComponent } from './component/events/events.component';
import { CalendarComponent } from './component/calendar/calendar.component';
import { DatePipe } from '@angular/common';
import { PrivacyComponent } from './component/privacy/privacy.component';
import { AboutComponent } from './component/about/about.component';
import { SearchComponent } from './component/search/search.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [authGuard] },
    {
        path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], children: [
            { path: 'calendar', redirectTo: `calendar/${new DatePipe('en-US').transform(new Date(), 'yyyy/MM')}`, pathMatch: 'full'},
            { path: 'calendar/:year/:month', component: CalendarComponent },
            { path: 'calendar/:year/:month/:date', component: EventsComponent },
            { path: 'search', component: SearchComponent },
            { path: 'tags', component: TagsComponent }
        ]
    },
    { path: 'privacy', component: PrivacyComponent },
    { path: 'about', component: AboutComponent }
];
