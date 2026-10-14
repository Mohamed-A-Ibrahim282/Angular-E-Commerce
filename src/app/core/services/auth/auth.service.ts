import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';
import { JwtDecodeOptions } from '../../../../../node_modules/jwt-decode/build/esm/index.d';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  private readonly router = inject(Router)
  private readonly cookieService = inject(CookieService)

  sendRegisterData(data: object): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/api/v1/auth/signup`, data)
  }

  sendLoginData(data: object): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/api/v1/auth/signin`, data)
  }

  signOut(): void {
    this.cookieService.delete("myToken");
    this.router.navigate(['/login']);
  }

  setForgetPassword(data: object): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/api/v1/auth/forgotPasswords`, data)
  }

  setVerifyResetCode(data: object): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/api/v1/auth/verifyResetCode`, data)
  }

  setResetPassword(data: object): Observable<any> {
    return this.httpClient.put(`${environments.baseUrl}/api/v1/auth/resetPassword`, data)
  }
}
