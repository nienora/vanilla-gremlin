import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { UserService } from '../user.service';
import { OrderService } from '../order.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnDestroy {

  form = {
    qty: 1,
    firstname: '',
    lastname: '',
    address: '',
    phone: ''
  };
  product = null;
  isFavorite = null;

  routeSubscription = null;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private productService: ProductService, private orderService: OrderService, private messageService: MessageService) { }

  ngOnInit() {
    const currentUser = this.userService.getCurrentUserImmediate();

    if (!currentUser) {
      this.router.navigate(['/login']);
    } else {
      this.form.firstname = currentUser.firstname;
      this.form.lastname = currentUser.lastname;
      this.form.address = currentUser.address;
      this.form.phone = currentUser.phone;

      this.routeSubscription = this.route.paramMap.subscribe(params => {
        const productId = params.get('id');
  
        this.product = this.productService.getProductById(productId);

        if (this.product) {
          this.isFavorite = currentUser.favorites.includes(this.product.id);
        } else {
          this.router.navigate(['/menu']);
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  favorite() {
    this.userService.toggleFavoriteProduct(this.product.id);
  }

  order() {
    if (this.orderService.addOrder({
      ...this.form,
      product: this.product
    })) {
      this.messageService.preserveData();

      this.router.navigate(['/orders']);
    }
  }

  get total() {
    return (this.product.price * this.form.qty).toFixed(2);
  }

  get formComplete() {
    return this.form.firstname && this.form.lastname && this.form.address && this.form.phone && Number.isInteger(this.form.qty) && this.form.qty > 0;
  }

}
