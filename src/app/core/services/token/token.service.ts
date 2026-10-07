import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly platformId = inject(PLATFORM_ID);

  tokenData: any = isPlatformBrowser(this.platformId) && localStorage.getItem('userToken')
    ? jwtDecode(JSON.stringify(localStorage.getItem('userToken')))
    : null;
}
