import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {

  const platformId = inject(PLATFORM_ID)
  const cookieService = inject(CookieService)

  if (isPlatformBrowser(platformId)) {
    if (cookieService.get("myToken")) {
      req = req.clone({
        setHeaders: {
          token: cookieService.get("myToken"),
        }
      })
    }
  }

  return next(req);
};
