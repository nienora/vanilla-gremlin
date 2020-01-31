import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  host: { class: 'header' }
})
export class HeaderComponent implements OnInit, OnDestroy {

  currentUser = undefined;

  currentUserSubscription = null;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.currentUserSubscription = this.userService.getCurrentUser().subscribe(currentUser => {
      this.currentUser = currentUser;
    });
  }

  ngOnDestroy() {
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
  }

  logout() {
    this.userService.logoutUser();

    this.router.navigate(['/']);
  }

}
