import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { UserService } from './user.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private id = 1;
  private orders = [{
    id: 0,
    userId: 0,
    userName: 'Test Test',
    userContact: 'Test (тел: 123456789)',
    productId: 0,
    productName: 'Пљескавица',
    productDescription: 'Пљескавица 200 грама',
    time: 20,
    qty: 2,
    total: 400,
    status: 'ЗАВРШЕНА',
    date: new Date(),
    review: null
  }];
  private ordersByUser = [];

  private ordersByUser$ = new BehaviorSubject<any>([]);

  constructor(private userService: UserService, private messageService: MessageService) { }

  loadOrdersByCurrentUser() {
    const currentUser = this.userService.getCurrentUserImmediate()

    this.ordersByUser = this.orders.filter(order => order.userId == currentUser.id).sort((a, b) => b.id - a.id);

    this.ordersByUser$.next(this.ordersByUser);
  }

  getReviewsByProduct(productId: number) {
    return this.orders.filter(order => order.productId == productId && order.review).map(order => order.review);
  }

  getOrderById(id) {
    return this.orders.find(order => order.id == id);
  }

  addOrder(data: any) {
    this.messageService.clear();

    const currentUser = this.userService.getCurrentUserImmediate();

    this.orders.push({
      id: this.id++,
      userId: currentUser.id,
      userName: data.firstname + ' ' + data.lastname,
      userContact: data.address + ' (тел: ' + data.phone + ')',
      productId: data.product.id,
      productName: data.product.name,
      productDescription: data.product.description,
      time: data.product.time,
      qty: data.qty,
      total: data.qty * data.product.price,
      status: 'ТЕКУЋА',
      date: new Date(),
      review: null
    });

    // Save order ID for timeout callback
    const orderId = this.id - 1;

    this.messageService.setSuccess(`Ваша поруџбина са бројем ${orderId} је успешно креирана.`);

    setTimeout(() => {
      const order = this.orders.find(order => order.id == orderId);

      if (order.status != 'ОТКАЗАНА') {
        this.orders.find(order => order.id == orderId).status = this.getRandomOrderStatus();

        this.loadOrdersByCurrentUser();
      }
    }, 10000);

    this.loadOrdersByCurrentUser();

    return true;
  }

  cancelOrder(id) {
    this.messageService.clear();

    const currentUser = this.userService.getCurrentUserImmediate();
    const order = this.orders.find(order => order.id == id);

    if (!currentUser || !order || currentUser.id != order.userId) {
      this.messageService.setError(`Дошло је до грешке, поруџбина не постоји.`);

      return false;
    }

    order.status = 'ОТКАЗАНА';

    this.messageService.setSuccess(`Ваша поруџбина са бројем ${id} је успешно отказана.`);

    this.loadOrdersByCurrentUser();

    return true;
  }

  reviewOrder(id, data) {
    this.messageService.clear();

    const currentUser = this.userService.getCurrentUserImmediate();
    const order = this.orders.find(order => order.id == id);

    if (!currentUser || !order || currentUser.id != order.userId) {
      this.messageService.setError(`Дошло је до грешке, поруџбина не постоји.`);

      return false;
    }

    order.review = {
      rating: Number.parseInt(data.rating),
      comment: data.comment
    };

    this.messageService.setSuccess(`Ваша утисак за наруџбину са бројем ${id} је сачуван.`);

    this.loadOrdersByCurrentUser();

    return true;
  }

  get ordersByCurrentUser() {
    return this.ordersByUser$.asObservable();
  }

  private getRandomOrderStatus() {
    const statuses = ['ЗАВРШЕНА', 'ОТКАЗАНА'];

    return statuses[Math.floor(Math.random() * statuses.length)];
  }

}
