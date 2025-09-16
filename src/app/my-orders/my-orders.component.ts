import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../order.service';
import { Order } from '../model/order.model';
import {FormsModule} from '@angular/forms';
import {OrderResponseDTO, OrderStatus} from '../model/order-response-dto.model';
import {OrderSummary} from '../model/OrderSummary.model';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent implements OnInit {

  orders: OrderResponseDTO[] = [];
  orderSummery: OrderSummary[] = [];
  loading: boolean = true;
  error: string | null = null;

  // Filter properties
  fromDate: string = null as any;
  toDate: string = null as any;
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
  ];



  // -------------------



  // orders: Order[] = [];
  // loading: boolean = true;
  // error: string | null = null;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.orderService.getOrdersForUser().subscribe({
      next: (data) => {
        this.orderSummery = data as any;
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
    this.loading = true;
    this.error = null;

    const status = this.selectedStatus === 'ALL' ? undefined : this.selectedStatus;
    const categoryId = this.selectedCategory === 'ALL' ? undefined : this.selectedCategory;

    this.orderService.getAllOrdersForUser(
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

  viewOrderDetails(orderId: number) {
    //redirect to order details page
    console.log("redirecting to order details page");
    console.log("order id", orderId);
    this.router.navigate(['/my-orders', orderId]);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}
