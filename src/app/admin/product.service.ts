import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {CategoryResponse} from '../model/categoryResponse.model';

@Injectable({
  providedIn: 'root'
})
export class ProductAdminService {
  private apiUrl = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) { }

  createProduct(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData, {
      headers: {
        'Accept': '*/*'
      }
    });
  }

  getAllCategories(): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/categories`);
  }

  getProductById(id: number) {
    // Assuming the backend endpoint is /products/{id}
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateProduct(productId: number, formData1: any) {
    // Assuming the backend endpoint is /products/{id}
    return this.http.put(`${this.apiUrl}/${productId}`, formData1, {
      headers: {
        'Accept': '*/*'
      }
    });
  }
}
