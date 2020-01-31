import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form = {
    firstname: '',
    lastname: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    passwordConfirm: ''
  };

  constructor(private router: Router, private userService: UserService, private messageService: MessageService) { }

  ngOnInit() {
    const currentUser = this.userService.getCurrentUserImmediate();

    if (currentUser) {
      this.router.navigate(['/menu']);
    }
  }

  get formComplete() {
    return this.form.firstname && this.form.lastname && this.form.address && this.form.phone && this.form.email && this.form.password && this.form.passwordConfirm;
  }

  registration() {
    if (this.userService.registerUser(this.form)) {
      this.messageService.preserveData();

      this.router.navigate(['/login']);
    }
  }

}
