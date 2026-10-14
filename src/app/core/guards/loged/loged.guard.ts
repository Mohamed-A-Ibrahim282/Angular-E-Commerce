import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const logedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const platformId = inject(PLATFORM_ID)
  const cookieService = inject(CookieService)

  if (!isPlatformBrowser(platformId)) {
    return true
  }

  return cookieService.check("myToken") === false
    ? true
    : router.createUrlTree(['/home'])
};
