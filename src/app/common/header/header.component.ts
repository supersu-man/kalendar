import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { TokenService } from '../../service/token.service';


@Component({
  selector: 'app-header',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {

  router = inject(Router)
  tokenService = inject(TokenService)
  logout = () => {
    this.tokenService.removeToken()
    this.router.navigate(['/'])
  }
}
