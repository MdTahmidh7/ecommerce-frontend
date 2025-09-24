import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiBaseUrl; // Use environment variable for API URL

  constructor(private http: HttpClient) { }

  getProducts(page:number,size:number): Observable<Product[]> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('size', size.toString());

    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params });
  }
}
