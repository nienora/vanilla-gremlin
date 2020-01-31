import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

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

    if (!currentUser) {
      this.router.navigate(['/login']);
    } else {
      this.form.firstname = currentUser.firstname;
      this.form.lastname = currentUser.lastname;
      this.form.address = currentUser.address;
      this.form.phone = currentUser.phone;
      this.form.email = currentUser.email;
    }
  }

  get formComplete() {
    return this.form.firstname && this.form.lastname && this.form.address && this.form.phone && this.form.email && ((this.form.password && this.form.passwordConfirm) || (!this.form.password && !this.form.passwordConfirm));
  }

  updateProfile() {
    if (this.userService.updateUser(this.form)) {
      this.messageService.preserveData();

      this.router.navigate(['/menu']);
    }
  }

}
