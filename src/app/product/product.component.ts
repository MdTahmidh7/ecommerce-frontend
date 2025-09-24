import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Product} from '../model/product.model';
import {Router} from '@angular/router';
import { ProductService } from './product.service';
import {environment} from '../../environments/environment';

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
  currentPage = 0;
  itemsPerPage = 10;
  totalPages = 0;
  pageNumbers: number[] = [];

  environment = environment;

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.isLoading = true;
    this.productService.getProducts(this.currentPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.products = response.content;
        this.totalPages = response.totalPages;
        this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.isLoading = false;
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.fetchProducts();
    }
  }

  navigateToProductDetailsPage(product: Product): void {
    this.router.navigate(['/products', product.id]);
  }
}
