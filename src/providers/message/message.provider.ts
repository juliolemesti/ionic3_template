import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class MessageProvider {

  toastActive: boolean;

  constructor(
    private toast: ToastController
  ) { }

  app(message: string | MessageOptions) {
    if (typeof message === 'string') {
      message = { message };
    }

    this.showToast(message);
  }

  http(message: string | MessageOptions) {
    if (typeof message === 'string') {
      message = { message };
    }

    this.showToast(message);
  }

  private async showToast(message) {
    if (this.toastActive) return;

    let duration = 6000;

    this.toast.create({
      message: message.message,
      duration,
      position: 'top'
    }).present();

    this.toastActive = true;

    setTimeout(() => this.toastActive = false, duration);
  }
}

export interface MessageOptions {
  title?: string;
  message?: string;
  code?: string;
}
