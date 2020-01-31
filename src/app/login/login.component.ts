import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form = {
    email: '',
    password: ''
  };

  constructor(private router: Router , private userService: UserService) { }

  ngOnInit() {
    const currentUser = this.userService.getCurrentUserImmediate()

    if (currentUser) {
      this.router.navigate(['/menu']);
    }
  }

  get formComplete() {
    return this.form.email && this.form.password;
  }

  login() {
    if (this.userService.loginUser(this.form)) {
      this.router.navigate(['/menu']);
    }
  }

}
