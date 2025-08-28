import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminOrderService } from '../admin-order.service';
import { OrderResponseDTO, OrderStatus } from '../../model/order-response-dto.model';
import {OrderSummary} from '../../model/OrderSummary.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {
  orders: OrderResponseDTO[] = [];
  orderSummery: OrderSummary[] = [];
  loading: boolean = true;
  error: string | null = null;

  // Filter properties
  fromDate: string;
  toDate: string;
  selectedStatus: OrderStatus | 'ALL' = 'ALL';
  selectedCategory: number | 'ALL' = 'ALL';

  // Pagination properties
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;

  orderStatuses = Object.values(OrderStatus);
  categories: any[] = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Books' },
    { id: 3, name: 'Clothing' }
  ]; // Placeholder for categories

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
    this.applyFilters();
  }

  applyFilters(): void {
    this.loading = true;
    this.error = null;

    const status = this.selectedStatus === 'ALL' ? undefined : this.selectedStatus;
    const categoryId = this.selectedCategory === 'ALL' ? undefined : this.selectedCategory;

    this.adminOrderService.getAllOrdersForAdmin(
      status,
      this.fromDate,
      this.toDate,
      categoryId,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (data) => {
        // this.orders = data.content;
        this.orderSummery = data;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders. Please try again later.';
        this.loading = false;
        console.error('Error fetching admin orders:', err);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  resetFilters(): void {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    this.toDate = today.toISOString().split('T')[0];
    this.fromDate = oneMonthAgo.toISOString().split('T')[0];
    this.selectedStatus = 'ALL';
    this.selectedCategory = 'ALL';
    this.currentPage = 0;
    this.applyFilters();
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  viewOrderDetails(orderId: number) {
    //redirect to order details page
    console.log("redirecting to order details page");
    console.log("order id", orderId);
    this.router.navigate(['/admin/orders', orderId]);
  }
}
