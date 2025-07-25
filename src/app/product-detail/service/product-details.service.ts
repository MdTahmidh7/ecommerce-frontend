import { Injectable } from '@angular/core';
import * as http from 'http';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  //call api for getAllDivisions
  getAllDivisions(){
    return this.http.get<any>(`${this.apiUrl}/api/divisions`);
  }

  getAllUpazilaByDistrictId(districtId: string) {
    return this.http.get<any>(`${this.apiUrl}/api/upazilas/district/${districtId}`);
  }

  getAllDistrictByDivisionId(divisionId: string) {
    return this.http.get<any>(`${this.apiUrl}/api/districts/division/${divisionId}`);
  }

  getProductById(productId: string) {
    return this.http.get<any>(`${this.apiUrl}/api/products/${productId}`);
  }
}
