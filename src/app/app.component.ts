import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from "./common/header/header.component";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ToastModule],
    templateUrl: './app.component.html',
    styles: []
})
export class AppComponent {}
