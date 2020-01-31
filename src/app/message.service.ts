import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages = {
    errorText: '',
    successText: ''
  };
  private preserve = false;

  private messages$ = new BehaviorSubject<any>({});

  constructor() { }

  setSuccess(text: string) {
    this.messages.successText = text;

    this.messages$.next(Object.assign({}, this.messages));
  }

  setError(text: string) {
    this.messages.errorText = text;

    this.messages$.next(Object.assign({}, this.messages));
  }

  // Return messages as observable
  getMessages() {
    return this.messages$.asObservable();
  }

  // In case we want to preserve status messages and not clear them on next navigation event
  preserveData() {
    this.preserve = true;
  }

  // Clear the status messages and notify observers
  clear() {
    if (!this.preserve) {
      this.messages.errorText = '';
      this.messages.successText = '';

      this.messages$.next(Object.assign({}, this.messages));
    }

    this.preserve = false;
  }

}
