import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environments } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly httpClient = inject(HttpClient)
  private readonly platformId = inject(PLATFORM_ID)

  userToken = isPlatformBrowser(this.platformId) ? localStorage.getItem("userToken") : ''


  addProductToCart(id: string): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/api/v1/cart`,
      { productId: id }
    )
  }

  getLoggedUserCart(): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return EMPTY;
    }
    return this.httpClient.get(`${environments.baseUrl}/api/v1/cart`)
  }

  removeSpecificCartItem(id: string): Observable<any> {
    return this.httpClient.delete(`${environments.baseUrl}/api/v1/cart/${id}`)
  }

  updateCartProductQuantity(id: string, count: string): Observable<any> {
    return this.httpClient.put(`${environments.baseUrl}/api/v1/cart/${id}`,
      { count: count }
    )
  }

  clearUserCart(): Observable<any> {
    return this.httpClient.delete(`${environments.baseUrl}/api/v1/cart`)
  }
}
