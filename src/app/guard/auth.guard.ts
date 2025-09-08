import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../service/token.service';


export const authGuard: CanActivateFn = async (route, state) => {

  const router = inject(Router)
  const tokenService = inject(TokenService)

  const token = tokenService.getToken()

  // if(!token && state.url != '/') {
  //   router.navigate(["/"])
  //   return false
  // }
  
  // if(token && state.url == "/") {
  //   router.navigate(["/dashboard/calendar"])
  //   return false
  // }

  return true;
};
