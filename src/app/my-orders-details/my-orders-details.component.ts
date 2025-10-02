import {Component, OnInit} from '@angular/core';
import {CurrencyPipe, DatePipe, NgClass, NgIf} from '@angular/common';
import {OrderDetailsDTO} from '../model/OrderDetails.model';
import {ActivatedRoute} from '@angular/router';
import {OrderService} from '../order.service';
import {environment} from '../../environments/environment';
import {AlertService} from '../common-service/alert.service';

@Component({
  selector: 'app-my-orders-details',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    NgIf,
    NgClass
  ],
  templateUrl: './my-orders-details.component.html',
  styleUrl: './my-orders-details.component.css'
})
export class MyOrdersDetailsComponent implements OnInit{

  environment = environment;
  public orderDetails: OrderDetailsDTO | null = null;
  private orderId: number | null = null;
  shippingCost: number = environment.shippingCost;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.orderId = Number(params.get('id'));
    });
    this.loadOrderDetails();
  }

  loadOrderDetails(): void {
    if (this.orderId !== null) {
      this.orderService.getOrderDetailsByOrderId(this.orderId).subscribe({
        next: value => {
          this.orderDetails = value;
          console.log("Order Details = ", this.orderDetails);
        },
        error: error => {
          // Handle error appropriately
          let errorMessage = 'An unexpected error occurred.';
          if (error && error.error) {
            // If the error body is already a JSON object
            if (typeof error.error === 'object' && error.error.message) {
              errorMessage = error.error.message;
            }
            // If the error body is a JSON string, attempt to parse it
            else if (typeof error.error === 'string') {
              try {
                const parsedError = JSON.parse(error.error);
                if (parsedError.message) {
                  errorMessage = parsedError.message;
                }
              } catch (e) {
                console.error('Failed to parse error response:', e);
              }
            }
          }
          this.alertService.error('Error', errorMessage);
        }
      });
    }
  }


  onImageError($event: ErrorEvent) {
  }

  getProductPrice() {
    if (this.orderDetails && this.orderDetails.productCount > 0) {
      return this.orderDetails.productCount * this.orderDetails.productPrice
    }
    return 0;
  }

  getTotalPrice() {
    return this.getProductPrice() + this.shippingCost;
  }

}
