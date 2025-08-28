import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from './model/order.model';
import { environment } from '../environments/environment';
import {CreateOrderRequest} from './model/CreateOrderRequest.moel';
import {OrderDetailsDTO} from './model/OrderDetails.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = `${environment.apiBaseUrl}/orders`;

  constructor(private http: HttpClient) { }

  getOrdersForUser(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}`);
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
}
