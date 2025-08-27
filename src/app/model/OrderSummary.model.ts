export interface OrderSummary {
  orderId: number;
  customerName: string;
  customerPhone: string;
  totalPrice: number;  // JSON returns 100.00, safe as number
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  creationDate: string;  // ISO timestamp string
  totalItems: number;
  primaryProductName: string;
  itemsSummary: string;
}
