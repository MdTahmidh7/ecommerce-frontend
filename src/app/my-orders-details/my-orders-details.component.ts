import {Component, OnInit} from '@angular/core';
import {CurrencyPipe, DatePipe, NgClass, NgIf} from '@angular/common';
import {OrderDetailsDTO} from '../model/OrderDetails.model';
import {ActivatedRoute} from '@angular/router';
import {OrderService} from '../order.service';
import {environment} from '../../environments/environment';

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

  constructor(private route: ActivatedRoute,
              private orderService: OrderService
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

}
