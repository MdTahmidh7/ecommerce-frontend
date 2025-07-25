import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Product} from '../model/product.model';
import {Router} from '@angular/router';
import { ProductService } from './product.service';

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

  constructor(private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data.content;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.isLoading = false;
      }
    });
  }

  

  navigateToProductDetailsPage(product: Product) {
    this.router.navigate(['/products', product.id]);
  }
}
