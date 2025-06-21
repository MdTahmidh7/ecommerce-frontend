export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  badgeType?: 'new' | 'hot' | 'sale';
  category: string;
  inStock: boolean;
}
