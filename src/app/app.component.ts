import { Component, OnInit } from '@angular/core';
import { MessageService } from './message.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: { class: 'container' }
})
export class AppComponent implements OnInit {
 
  constructor(private router: Router, private messageService: MessageService) { }

  ngOnInit() {
    // Clear our error and success message on every router navigation event
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.messageService.clear();
    });
  }

}
