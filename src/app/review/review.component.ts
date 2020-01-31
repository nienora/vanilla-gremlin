import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { OrderService } from '../order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  form = {
    rating: '',
    comment: ''
  };
  order = null;

  routeSubscription = null;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private orderService: OrderService, private messageService: MessageService) { }

  ngOnInit() {
    const currentUser = this.userService.getCurrentUserImmediate();

    if (!currentUser) {
      this.router.navigate(['/login']);
    } else {
      this.routeSubscription = this.route.paramMap.subscribe(params => {
        const orderId = params.get('id');
  
        this.order = this.orderService.getOrderById(orderId);

        if (this.order.review) {
          this.router.navigate(['/orders']);
        }
      });
    }
  }

  review() {
    if (this.orderService.reviewOrder(this.order.id, this.form)) {
      this.messageService.preserveData();

      this.router.navigate(['/orders']);
    }
  }

  get formComplete() {
    return this.form.rating && this.form.comment && Number.isInteger(Number.parseInt(this.form.rating)) && Number.parseInt(this.form.rating) >= 0 && Number.parseInt(this.form.rating) <= 5;
  }

}
