import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// Make sure these models and services exist in your project
import { OrderService } from '../order.service';
import { OrderSummary } from '../model/OrderSummary.model';
import { OrderStatus } from '../model/order-response-dto.model';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  orderSummaries: OrderSummary[] = [];
  loading: boolean = true;
  error: string | null = null;

  // Filter properties
  fromDate: string | null = null;
  toDate: string | null = null;
  selectedStatus: OrderStatus | 'ALL' = 'ALL';
  selectedCategory: number | 'ALL' = 'ALL';

  // Pagination properties
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  pageLinksToShow: number = 5;

  orderStatuses = Object.values(OrderStatus);
  categories: any[] = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Books' },
    { id: 3, name: 'Clothing' }
  ];

  constructor(
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  private fetchOrders(): void {
    this.loading = true;
    this.error = null;

    // Convert 'ALL' to undefined for the service call
    const statusParam = this.selectedStatus === 'ALL' ? undefined : this.selectedStatus;
    const categoryParam = this.selectedCategory === 'ALL' ? undefined : this.selectedCategory;

    this.orderService.getAllOrdersForUser(
      statusParam,
      this.fromDate as any,
      this.toDate as any,
      categoryParam,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (pageData: any) => { // Make sure your service returns a Page object
        this.orderSummaries = pageData.content;
        this.totalPages = pageData.totalPages;
        this.totalElements = pageData.totalElements;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders. Please try again later.';
        this.loading = false;
        console.error('Error fetching orders:', err);
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 0; // Reset to the first page on new filter
    this.fetchOrders();
  }

  resetFilters(): void {
    this.fromDate = null;
    this.toDate = null;
    this.selectedStatus = 'ALL';
    this.selectedCategory = 'ALL';
    this.currentPage = 0;
    this.fetchOrders();
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/my-orders', orderId]);
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.fetchOrders();
    }
  }

  getPages(): number[] {
    const startPage = Math.max(0, this.currentPage - Math.floor(this.pageLinksToShow / 2));
    const endPage = Math.min(this.totalPages - 1, startPage + this.pageLinksToShow - 1);
    const pages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
}

// NOTE: Please ensure your OrderService returns a Page object with 'content', 'totalPages', and 'totalElements' properties.
// Example: { content: OrderSummary[], totalPages: number, totalElements: number }
