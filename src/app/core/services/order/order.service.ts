import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient) { }
  private readonly platformId = inject(PLATFORM_ID)

  uerToken = isPlatformBrowser(this.platformId) ? localStorage.getItem("userToken") : null

  createCashOrderFromCart(cartId: string, data: any): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/api/v1/orders/${cartId}`,
      { shippingAddress: data }
    )
  }

  createOnlineOrderFromCart(cartId: string, data: any): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=http://localhost:4200`,
      { shippingAddress: data }
    )
  }

  getUserOrders(id: string): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/api/v1/orders/user/${id}`)
  }
}
