// src/app/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink], // Removed SwiperModule, SwiperComponent, SwiperDirective, CUSTOM_ELEMENTS_SCHEMA
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Data for categories, best sellers, and new arrivals
  categories = [
    { name: 'Women\'s Fashion', image: 'https://placehold.co/600x400/DEDEF7/5C5C8C?text=Women', link: '/products?category=womens'},
    { name: 'Men\'s Fashion', image: 'https://placehold.co/600x400/E8F5E9/4CAF50?text=Men', link: '/products?category=mens'},
    { name: 'Accessories', image: 'https://placehold.co/600x400/FFF3E0/FF9800?text=Accessories', link: '/products?category=accessories'},
    { name: 'Footwear', image: 'https://placehold.co/600x400/E0F7FA/00BCD4?text=Footwear', link: '/products?category=footwear'},
  ];

  bestSellers = [
    { id: 1, name: 'Elegant Silk Scarf', price: '49.99', image: 'https://placehold.co/300x400/FFD1DC/E0BBE4?text=Scarf', link: '/product/1'},
    { id: 2, name: 'Leather Crossbody Bag', price: '129.00', image: 'https://placehold.co/300x400/D4EDDA/81C784?text=Bag', link: '/product/2'},
    { id: 3, name: 'Classic Fit Jeans', price: '75.50', image: 'https://placehold.co/300x400/F0F8FF/D8BFD8?text=Jeans', link: '/product/3'},
    { id: 4, name: 'Minimalist Watch', price: '199.99', image: 'https://placehold.co/300x400/F5F5DC/CFC8D2?text=Watch', link: '/product/4'},
    { id: 5, name: 'Designer Sunglasses', price: '89.00', image: 'https://placehold.co/300x400/FFDBCC/F7A8B8?text=Sunglasses', link: '/product/5'},
  ];

  newArrivals = [
    { id: 6, name: 'Summer Linen Dress', price: '65.00', image: 'https://placehold.co/300x400/C8F8FF/81D4FA?text=Dress', link: '/product/6'},
    { id: 7, name: 'Premium Polo Shirt', price: '45.00', image: 'https://placehold.co/300x400/FFECB3/FFB300?text=Polo', link: '/product/7'},
    { id: 8, name: 'Boho Chic Bracelet', price: '29.99', image: 'https://placehold.co/300x400/E0F7FA/B2EBF2?text=Bracelet', link: '/product/8'},
    { id: 9, name: 'High-Top Sneakers', price: '95.00', image: 'https://placehold.co/300x400/F3E5F5/CE93D8?text=Sneakers', link: '/product/9'},
    { id: 10, name: 'Vintage Denim Jacket', price: '110.00', image: 'https://placehold.co/300x400/C8E6C9/A5D6A7?text=Jacket', link: '/product/10'},
  ];

  constructor() { }

  ngOnInit(): void {
    // Initialization logic if any
  }
}
