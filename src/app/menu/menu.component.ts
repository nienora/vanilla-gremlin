import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  form = {
    query: '',
    priceMax: '',
    timeMax: '',
    averageRating: ''
  };
  products = [];

  searchTimeout = null;

  constructor(private router: Router, private userService: UserService, private productService: ProductService) { }

  ngOnInit() {
    const currentUser = this.userService.getCurrentUserImmediate();

    if (!currentUser) {
      this.router.navigate(['/login']);
    }
    
    this.doSearch(true);
  }

  doSearch(initial: boolean = false) {
    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      this.products = this.productService.getProductsWithReviews(
        this.form.query,
        this.form.priceMax ? Number.parseInt(this.form.priceMax) : null,
        this.form.timeMax ? Number.parseInt(this.form.timeMax) : null,
        this.form.averageRating ? Number.parseInt(this.form.averageRating) : null
      );
    }, initial ? 0 : 500);
  }

  viewProduct(id) {
    this.router.navigate(['/product', id]);
  }

}
