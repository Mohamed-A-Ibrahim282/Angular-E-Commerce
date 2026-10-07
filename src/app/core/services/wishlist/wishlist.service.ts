import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private httpClient: HttpClient) { }

  setAddToWishlist(id: string): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/api/v1/wishlist`, {
      productId: id
    })
  }

  setRemoveFromWishlist(id: string): Observable<any> {
    return this.httpClient.delete(`${environments.baseUrl}/api/v1/wishlist/${id}`)
  }

  getLoggedUserWishlist(): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/api/v1/wishlist`)
  }
}
