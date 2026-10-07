import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const logedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const platformId = inject(PLATFORM_ID)

  if (!isPlatformBrowser(platformId)) {
    return true
  }

  return localStorage.getItem('userToken') === null
    ? true
    : router.createUrlTree(['/home'])
};
