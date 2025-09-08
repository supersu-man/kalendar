import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { sendTokenInterceptor, saveTokenInterceptor, refreshTokenInterceptor } from './service/interceptor.service';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([sendTokenInterceptor, saveTokenInterceptor, refreshTokenInterceptor])),
    provideAnimations(),
  ]
};
