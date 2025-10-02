import {OrderItem} from './OrderItem.model';

export interface CreateOrderRequest {
  districtName:string;
  upazilaName:string;
  upazilaId: number;
  userId: number;
  orderItems: OrderItem[];
}
