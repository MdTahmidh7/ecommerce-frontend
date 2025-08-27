import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderResponseDTO, OrderStatus } from '../model/order-response-dto.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminOrderService {
  private apiUrl = `${environment.apiBaseUrl}/orders/all`;

  constructor(private http: HttpClient) { }

  getAllOrdersForAdmin(
    status?: OrderStatus,
    startDate?: string,
    endDate?: string,
    categoryId?: number,
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    let params = new HttpParams();
    if (status) {
      params = params.append('status', status);
    }
    if (startDate) {
      params = params.append('startDate', startDate);
    }
    if (endDate) {
      params = params.append('endDate', endDate);
    }
    if (categoryId) {
      params = params.append('categoryId', categoryId.toString());
    }
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());

    return this.http.get<any>(this.apiUrl);
  }
}
