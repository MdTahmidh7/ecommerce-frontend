// src/app/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html', // Reference to the updated HTML
  styleUrls: ['./home.component.css'] // Reference to the custom CSS
})
export class HomeComponent {
  // Data for categories, best sellers, and new arrivals
  // In a real app, this would come from a service/backend
  categories = [
    { name: 'Women\'s Fashion', image: 'https://placehold.co/600x400/DEDEF7/5C5C8C?text=Women', link: '#'},
    { name: 'Men\'s Fashion', image: 'https://placehold.co/600x400/E8F5E9/4CAF50?text=Men', link: '#'},
    { name: 'Accessories', image: 'https://placehold.co/600x400/FFF3E0/FF9800?text=Accessories', link: '#'},
    { name: 'Footwear', image: 'https://placehold.co/600x400/E0F7FA/00BCD4?text=Footwear', link: '#'},
  ];

  bestSellers = [
    { id: 1, name: 'Elegant Silk Scarf', price: '49.99', image: 'https://placehold.co/300x400/FFD1DC/E0BBE4?text=Scarf', link: '#'},
    { id: 2, name: 'Leather Crossbody Bag', price: '129.00', image: 'https://placehold.co/300x400/D4EDDA/81C784?text=Bag', link: '#'},
    { id: 3, name: 'Classic Fit Jeans', price: '75.50', image: 'https://placehold.co/300x400/F0F8FF/D8BFD8?text=Jeans', link: '#'},
    { id: 4, name: 'Minimalist Watch', price: '199.99', image: 'https://placehold.co/300x400/F5F5DC/CFC8D2?text=Watch', link: '#'},
    { id: 5, name: 'Designer Sunglasses', price: '89.00', image: 'https://placehold.co/300x400/FFDBCC/F7A8B8?text=Sunglasses', link: '#'},
  ];

  newArrivals = [
    { id: 6, name: 'Summer Linen Dress', price: '65.00', image: 'https://placehold.co/300x400/C8F8FF/81D4FA?text=Dress', link: '#'},
    { id: 7, name: 'Premium Polo Shirt', price: '45.00', image: 'https://placehold.co/300x400/FFECB3/FFB300?text=Polo', link: '#'},
    { id: 8, name: 'Boho Chic Bracelet', price: '29.99', image: 'https://placehold.co/300x400/E0F7FA/B2EBF2?text=Bracelet', link: '#'},
    { id: 9, name: 'High-Top Sneakers', price: '95.00', image: 'https://placehold.co/300x400/F3E5F5/CE93D8?text=Sneakers', link: '#'},
    { id: 10, name: 'Vintage Denim Jacket', price: '110.00', image: 'https://placehold.co/300x400/C8E6C9/A5D6A7?text=Jacket', link: '#'},
  ];

  // Helper to chunk arrays for carousel slides (3 items per slide)
  chunkArray(array: any[], chunkSize: number): any[][] {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }

  bestSellersSlides = this.chunkArray(this.bestSellers, 3);
  newArrivalsSlides = this.chunkArray(this.newArrivals, 3);
}
