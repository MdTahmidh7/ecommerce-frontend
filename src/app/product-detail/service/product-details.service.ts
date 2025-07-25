import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsService {

  private apiUrl = environment.apiBaseUrl; // Use environment variable for API URL

  constructor(private http: HttpClient) { }

  //call api for getAllDivisions
  getAllDivisions(){
    return this.http.get<any>(`${this.apiUrl}/divisions`);
  }

  getAllUpazilaByDistrictId(districtId: string) {
    return this.http.get<any>(`${this.apiUrl}/upazilas/district/${districtId}`);
  }

  getAllDistrictByDivisionId(divisionId: string) {
    return this.http.get<any>(`${this.apiUrl}/districts/division/${divisionId}`);
  }

  getProductById(productId: string) {
    return this.http.get<any>(`${this.apiUrl}/products/${productId}`);
  }
}
