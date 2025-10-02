import {Component, OnInit} from '@angular/core';
import {OrderDetailsDTO} from '../../model/OrderDetails.model';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../../order.service';
import {CurrencyPipe, DatePipe, JsonPipe, NgClass, NgIf} from '@angular/common';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    NgIf,
    NgClass
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit{

  public orderDetails: OrderDetailsDTO | null = null;
  private orderId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.orderId = Number(params.get('id'));
    });
    this.loadOrderDetails();
  }

  //take order id from url



  loadOrderDetails(): void {
    if (this.orderId !== null) {
      this.orderService.getOrderDetailsByOrderId(this.orderId).subscribe({
        next: value => {
          this.orderDetails = value;
          console.log("Order Details = ", this.orderDetails);
        },
        error: err => {
          console.error("Failed to load order details", err);
        }
      });
    }
  }


  onImageError($event: ErrorEvent) {

  }

  getTotalPrice() {
    if (this.orderDetails && this.orderDetails.productCount > 0) {
      return this.orderDetails.productCount * this.orderDetails.productPrice
    }
    return 0;
  }

  protected readonly environment = environment;

  updateOrderStatus(orderStatus: string) {
    //call api to update order status
    if (this.orderId !== null) {
      this.orderService.updateOrderStatus(this.orderId, orderStatus).subscribe({
        next: value => {
          console.log("Order status updated successfully");
          //reload order details
          this.loadOrderDetails();
        },
        error: err => {
          console.error("Failed to update order status", err);
        }
      });
    }
  }

  redirectToAdminOrderListPage() {
    this.router.navigate(['/admin/orders']);
  }
}
