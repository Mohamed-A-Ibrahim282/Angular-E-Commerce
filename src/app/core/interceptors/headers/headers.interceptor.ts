import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {

  const platformId = inject(PLATFORM_ID)

  if (isPlatformBrowser(platformId)) {
    if (localStorage.getItem("userToken")) {
      req = req.clone({
        setHeaders: {
          token: localStorage.getItem("userToken")!
        }
      })
    }
  }

  return next(req);
};
