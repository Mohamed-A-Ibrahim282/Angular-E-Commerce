import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  constructor(private httpClient: HttpClient) { }

  getAllBrands(): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/api/v1/brands`)
  }

  getSpecificlBrand(id: string): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/api/v1/brands/${id}`)
  }
}
