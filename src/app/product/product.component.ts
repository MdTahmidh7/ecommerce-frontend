import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Product} from '../model/product.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  products: Product[] = [];
  isLoading = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Simulate API call delay
    setTimeout(() => {
      this.loadProducts();
      this.isLoading = false;
    }, 1000);
  }

  private loadProducts(): void {
    this.products = [
      {
        id: 1,
        name: 'Stylish Smartwatch Pro',
        description: 'Experience the future on your wrist with advanced health tracking, seamless connectivity, and stunning design.',
        price: 199.99,
        originalPrice: 249.99,
        image: 'https://placehold.co/400x300/667eea/ffffff?text=SmartWatch+Pro',
        rating: 4.9,
        reviewCount: 1250,
        badge: 'New',
        badgeType: 'new',
        category: 'Electronics',
        inStock: true
      },
      {
        id: 2,
        name: 'Wireless Headphones Elite',
        description: 'Immerse yourself in crystal-clear audio with noise cancellation and 30-hour battery life for all-day listening.',
        price: 99.50,
        originalPrice: 129.99,
        image: 'https://placehold.co/400x300/f093fb/ffffff?text=Wireless+Audio',
        rating: 4.7,
        reviewCount: 890,
        badge: 'Hot',
        badgeType: 'hot',
        category: 'Audio',
        inStock: true
      },
      {
        id: 3,
        name: 'Ergonomic Office Chair',
        description: 'Transform your workspace with premium comfort, lumbar support, and adjustable features for peak productivity.',
        price: 349.00,
        originalPrice: 429.00,
        image: 'https://placehold.co/400x300/43e97b/ffffff?text=Ergonomic+Chair',
        rating: 5.0,
        reviewCount: 2150,
        badge: 'Sale',
        badgeType: 'sale',
        category: 'Furniture',
        inStock: true
      },
      {
        id: 4,
        name: 'Gaming Mechanical Keyboard',
        description: 'Elevate your gaming experience with tactile switches, RGB lighting, and premium build quality.',
        price: 129.99,
        image: 'https://placehold.co/400x300/4facfe/ffffff?text=Gaming+Keyboard',
        rating: 4.6,
        reviewCount: 675,
        badge: 'Popular',
        badgeType: 'hot',
        category: 'Gaming',
        inStock: true
      },
      {
        id: 5,
        name: 'Wireless Charging Pad',
        description: 'Convenient and fast wireless charging for all your compatible devices with sleek design.',
        price: 39.99,
        originalPrice: 59.99,
        image: 'https://placehold.co/400x300/a78bfa/ffffff?text=Wireless+Charger',
        rating: 4.4,
        reviewCount: 420,
        badge: 'Deal',
        badgeType: 'sale',
        category: 'Accessories',
        inStock: false
      },
      {
        id: 6,
        name: 'Portable Bluetooth Speaker',
        description: '360-degree sound with waterproof design perfect for outdoor adventures and home entertainment.',
        price: 79.99,
        image: 'https://placehold.co/400x300/34d399/ffffff?text=Bluetooth+Speaker',
        rating: 4.8,
        reviewCount: 1100,
        category: 'Audio',
        inStock: true
      }
    ];
  }

  /*onAddToCart(product: Product): void {
    if (!product.inStock) {
      alert('Sorry, this product is currently out of stock!');
      return;
    }

    console.log('Adding to cart:', product);
    // Implement your cart logic here
    alert(`${product.name} added to cart!`);
  }*/

  getStars(rating: number): number[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(1);
    }

    if (hasHalfStar) {
      stars.push(0.5);
    }

    while (stars.length < 5) {
      stars.push(0);
    }

    return stars;
  }

  getDiscountPercentage(originalPrice: number, currentPrice: number): number {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  navigateToProductDetailsPage(product: Product) {
    this.router.navigate(['/products', product.id]);
  }
}
