import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminOrderService } from '../admin-order.service';
import { OrderStatus } from '../../model/order-response-dto.model';
import { OrderSummary } from '../../model/OrderSummary.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {

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
    private adminOrderService: AdminOrderService,
    private router: Router
  ) {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    this.toDate = today.toISOString().split('T')[0];
    this.fromDate = oneMonthAgo.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.fetchOrders();
  }

  private fetchOrders(): void {
    this.loading = true;
    this.error = null;

    // Convert 'ALL' to undefined for the service call
    const statusParam = this.selectedStatus === 'ALL' ? undefined : this.selectedStatus;
    const categoryParam = this.selectedCategory === 'ALL' ? undefined : this.selectedCategory;

    this.adminOrderService.getAllOrdersForAdmin(
      statusParam,
      this.fromDate as any,
      this.toDate as any,
      categoryParam,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (pageData: any) => {
        this.orderSummaries = pageData.content;
        this.totalPages = pageData.totalPages;
        this.totalElements = pageData.totalElements;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders. Please try again later.';
        this.loading = false;
        console.error('Error fetching admin orders:', err);
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 0; // Reset to the first page on new filter
    this.fetchOrders();
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.fetchOrders();
    }
  }

  resetFilters(): void {
    this.selectedStatus = 'ALL';
    this.selectedCategory = 'ALL';
    this.currentPage = 0;
    this.fetchOrders();
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

  viewOrderDetails(orderId: number) {
    this.router.navigate(['/admin/orders', orderId]);
  }
}
