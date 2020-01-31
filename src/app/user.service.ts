import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { MessageService } from './message.service';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

const VALID_EMAIL = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private id = 1;
  private users = [{
    id: 0,
    firstname: 'Test',
    lastname: 'Test',
    address: 'Test',
    phone: '123456789',
    email: 'test@test.com',
    password: CryptoJS.SHA1('test').toString(),
    favorites: []
  }];
  private currentUser = undefined;

  private currentUser$ = new BehaviorSubject<any>(undefined);

  constructor(private messageService: MessageService) { }

  registerUser(data: any) {
    this.messageService.clear();

    if (data.password != data.passwordConfirm) {
      this.messageService.setError('Лозинке морају да се подударају.');

      return false;
    }

    if (!VALID_EMAIL.test(data.email)) {
      this.messageService.setError('Унета имејл адреса није валидна.');

      return false;
    }

    if (this.users.find(user => user.email == data.email)) {
      this.messageService.setError('Корисник са наведеном имејл адресом већ постоји.');

      return false;
    }

    this.users.push({
      id: this.id++,
      firstname: data.firstname,
      lastname: data.lastname,
      address: data.address,
      phone: data.phone,
      email: data.email,
      password: CryptoJS.SHA1(data.password).toString(),
      favorites: []
    });

    this.messageService.setSuccess('Кориснички налог је успешно креиран.');

    return true;
  }

  loginUser(data: any) {
    this.messageService.clear();

    const passwordHash = CryptoJS.SHA1(data.password).toString();
    const foundUser = this.users.find(user => user.email == data.email && user.password == passwordHash);

    if (foundUser) {
      this.currentUser = foundUser;

      this.currentUser$.next(Object.assign({}, this.currentUser));

      return true;
    } else {
      this.messageService.setError('Унети подаци нису тачни, пробајте поново.');

      return false;
    }
  }

  updateUser(data: any) {
    this.messageService.clear();

    if (data.password && data.passwordConfirm && data.password != data.passwordConfirm) {
      this.messageService.setError('Лозинке морају да се подударају.');

      return false;
    }

    if (!VALID_EMAIL.test(data.email)) {
      this.messageService.setError('Унета имејл адреса није валидна.');

      return false;
    }

    const foundUser = this.users.find(user => user.email == data.email);

    if (foundUser && foundUser.id != this.currentUser.id) {
      this.messageService.setError('Корисник са наведеном имејл адресом већ постоји.');

      return false;
    }

    this.currentUser.firstname = data.firstname;
    this.currentUser.lastname = data.lastname;
    this.currentUser.address = data.address;
    this.currentUser.phone = data.phone;
    this.currentUser.email = data.email;

    if (data.password && data.passwordConfirm) {
      this.currentUser.password = CryptoJS.SHA1(data.password).toString();
    }

    this.currentUser$.next(Object.assign({}, this.currentUser));

    this.messageService.setSuccess('Измене на Вашем профилу су успешно сачуване.');

    return true;
  }

  logoutUser() {
    this.messageService.clear();

    this.currentUser = undefined;

    this.currentUser$.next(this.currentUser);
  }

  toggleFavoriteProduct(id) {
    if (this.currentUser.favorites.includes(id)) {
      this.currentUser.favorites = _.without(this.currentUser.favorites, id);
    } else {
      this.currentUser.favorites = _.union(this.currentUser.favorites, [id]);
    }

    this.currentUser$.next(Object.assign({}, this.currentUser));
  }

  getCurrentUser() {
    return this.currentUser$.asObservable();
  }

  getCurrentUserImmediate() {
    return this.currentUser;
  }

}
