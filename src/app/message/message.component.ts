import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  host: { class: 'message' }
})
export class MessageComponent implements OnInit, OnDestroy {

  messages = {
    errorText: '',
    successText: ''
  };

  messagesSubscription = null;

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.messagesSubscription = this.messageService.getMessages().subscribe(messages => {
      this.messages = messages;
    });
  }

  ngOnDestroy() {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }

}
