import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {

  orders = [];

  ordersSubscription = null;

  constructor(private router: Router, private userService: UserService, private orderService: OrderService) { }

  ngOnInit() {
    const currentUser = this.userService.getCurrentUserImmediate();

    if (!currentUser) {
      this.router.navigate(['/login']);
    } else {
      this.ordersSubscription = this.orderService.ordersByCurrentUser.subscribe(orders => {
        this.orders = orders;
      });

      this.orderService.loadOrdersByCurrentUser();
    }
  }

  ngOnDestroy() {
    if (this.ordersSubscription) {
      this.ordersSubscription.unsubscribe();
    }
  }

  cancel(id) {
    this.orderService.cancelOrder(id);
  }

  review(id) {
    this.router.navigate(['/review', id]);
  }

}
