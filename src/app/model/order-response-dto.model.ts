export interface OrderResponseDTO {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  // Add other fields as per your backend DTO
}

export enum OrderStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}
