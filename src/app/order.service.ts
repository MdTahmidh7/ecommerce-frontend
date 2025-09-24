import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from './model/order.model';
import { environment } from '../environments/environment';
import {CreateOrderRequest} from './model/CreateOrderRequest.moel';
import {OrderDetailsDTO} from './model/OrderDetails.model';
import {OrderStatus} from './model/order-response-dto.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = `${environment.apiBaseUrl}/orders`;

  constructor(private http: HttpClient) { }

  getOrdersForUser(page:number=0,size:number=10): Observable<Order[]> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('size', size.toString());
    return this.http.get<Order[]>(`${this.apiUrl}/me`,{params});
  }

  createOrder(orderRequest: CreateOrderRequest) {
    return this.http.post<Order>(`${this.apiUrl}`, orderRequest);
  }

  getOrderDetailsByOrderId(orderId:number | null):Observable<any> {
    return this.http.get<OrderDetailsDTO[]>(`${this.apiUrl}/`+orderId);
  }

  updateOrderStatus(orderId: number, status: string) {

    //sent status to request params
    let params = new HttpParams();
    if (status) {
      params = params.append('status', status);
    }

    return this.http.put(`${this.apiUrl}/${orderId}/status`, null, { params } );
  }

  getAllOrdersForUser(
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
      params = params.append('from', startDate);
    }
    if (endDate) {
      params = params.append('to', endDate);
    }
    /*if (categoryId) {
      params = params.append('categoryId', categoryId.toString());
    } */
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());

    return this.http.get<any>(`${this.apiUrl}/me`, { params });
  }
}
