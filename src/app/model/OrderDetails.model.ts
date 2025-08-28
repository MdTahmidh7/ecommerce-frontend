import {OrderStatus} from './order-response-dto.model';

export interface OrderDetailsDTO {
  orderId: number;
  customerName: string;
  customerPhone: string;
  upazilaId: number;
  status: OrderStatus;
  productId: number;
  productPrice: number;
  productCount: number;
  totalPrice: number;
  creationDate: string;
  productName: string;
  imageUrl: string;
  upazilaName: string;
  divisionName: string;
  districtName: string;
  address: string;
}
