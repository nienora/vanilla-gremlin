import { Injectable } from '@angular/core';
import { OrderService } from './order.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products = [{
    id: 0,
    name: 'Пљескавица',
    description: 'Пљескавица 200 грама',
    price: 200,
    time: 20
  }, {
    id: 1,
    name: 'Пљескавица (пуњена)',
    description: 'Пљескавица (пуњена) 200 грама',
    price: 250,
    time: 20
  }, {
    id: 2,
    name: 'Ћевапи (5 комада)',
    description: 'Ћевапи у лепињи (5 комада)',
    price: 250,
    time: 25
  }, {
    id: 3,
    name: 'Ћевапи (10 комада)',
    description: 'Ћевапи у лепињи (10 комада)',
    price: 500,
    time: 25
  }, {
    id: 4,
    name: 'Пица - Маргарита',
    description: 'Сир, парадајз сос, оригано - 32cm',
    price: 400,
    time: 30
  }, {
    id: 5,
    name: 'Пица - Каприћоза',
    description: 'Сир, шунка, парадајз сос, печурке, оригано - 32cm',
    price: 550,
    time: 30
  }, {
    id: 6,
    name: 'Бифтек',
    description: 'Бифтек на жару',
    price: 1000,
    time: 60
  }];

  constructor(private userService: UserService, private orderService: OrderService) { }

  getProductsWithReviews(query: string = '', priceMax: number = null, timeMax: number = null, rating: number = null) {
    return this.products.filter(product => {
      if (query && !product.name.toLowerCase().includes(query.toLowerCase()) && !product.description.includes(query.toLowerCase())) {
        return false;
      }

      if (priceMax && product.price > priceMax) {
        return false;
      }

      if (timeMax && product.time > timeMax) {
        return false;
      }

      const productReviews = this.orderService.getReviewsByProduct(product.id);
      const productRating = productReviews.length > 0 ? productReviews.reduce((a, e) => a + e.rating, 0) / productReviews.length : null;

      if (rating && (!productRating || productRating < rating)) {
        return false;
      }

      return true;
    }).map(product => {
      const productReviews = this.orderService.getReviewsByProduct(product.id);
      const productRating = productReviews.length > 0 ? (productReviews.reduce((a, e) => a + e.rating, 0) / productReviews.length).toFixed(1) : null;
      const currentUser = this.userService.getCurrentUserImmediate();
      const isFavorite = currentUser ? currentUser.favorites.includes(product.id) : false;

      return {
        ...product, productRating, isFavorite
      }
    });
  }

  getProductById(id) {
    const foundProduct = this.products.find(product => product.id == id);

    if (foundProduct) {
      const productReviews = this.orderService.getReviewsByProduct(id);
      const productRating = productReviews.length > 0 ? (productReviews.reduce((a, e) => a + e.rating, 0) / productReviews.length).toFixed(1) : null;

      return {
        ...foundProduct, productRating
      }
    } else {
      return false;
    }
  }

}
