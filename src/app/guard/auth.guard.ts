import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';


export const authGuard: CanActivateFn = async (route, state) => {

  const routerService = inject(Router)
  console.log(state.url)

  if(!localStorage.getItem('accessToken') && state.url != '/') {
    routerService.navigate(['/'])
    return false
  }

  return true;
};
