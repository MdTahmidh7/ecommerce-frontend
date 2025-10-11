import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';
import {Product} from '../../model/product.model';
import {ProductService} from '../../product/product.service';
import {environment} from '../../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {

  products: Product[] = [];
  isLoading = true;
  currentPage = 0;
  itemsPerPage = 10;
  totalPages = 0;
  pageNumbers: number[] = [];

  environment = environment;

  constructor(
    private productService: ProductService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

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

  navigateToUpdateProductPage(product: Product): void {
    this.router.navigate(['/admin/update-products', product.id]);
  }

  getSafeProductDescription(product: any): any {
    return  this.sanitizer.bypassSecurityTrustHtml(product.description || '');
  }
}
