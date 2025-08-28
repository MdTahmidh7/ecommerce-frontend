import {Component, OnInit} from '@angular/core';
import {OrderDetailsDTO} from '../../model/OrderDetails.model';
import {ActivatedRoute} from '@angular/router';
import {OrderService} from '../../order.service';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    JsonPipe
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit{

  orderDetails: OrderDetailsDTO[] = [];
  private orderId: number | null = null;

  constructor(private route: ActivatedRoute,
              private orderService: OrderService) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.orderId = Number(params.get('id'));
    });
    this.loadOrderDetails();
  }

  //take order id from url



  loadOrderDetails(): void {
    this.orderService.getOrderDetailsByOrderId(this.orderId).subscribe(
      value => {
        this.orderDetails = value
        console.log("Order Details = ",this.orderDetails)
      }
    )
  }


}
