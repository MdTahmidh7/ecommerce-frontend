export interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  // Add other relevant fields for an order
  // e.g., items: OrderItem[];
  // userId: number;
}
