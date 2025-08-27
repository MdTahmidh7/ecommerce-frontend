import {OrderItem} from './OrderItem.model';

export interface CreateOrderRequest {
  upazilaId: number;
  userId: number;
  orderItems: OrderItem[];
}
