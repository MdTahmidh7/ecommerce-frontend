import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}
