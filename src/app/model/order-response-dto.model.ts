export interface OrderResponseDTO {
  id: number;
  creationDate: string;
  totalAmount: number;
  status: OrderStatus;
  userName: string;
  // Add other fields as per your backend DTO
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}
