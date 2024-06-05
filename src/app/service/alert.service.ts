import { Injectable } from '@angular/core';
import { Alert } from '../model/alert';
import { timeout } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  alerts: Alert[] = []

  constructor() { }

  showAlert(alert: Alert) {
    alert.id = window.crypto.randomUUID()
    this.alerts.push(alert)
    setTimeout(() => {
      this.alerts = this.alerts.filter((item) => {
        return item.id != alert.id;
      });
    }, 2500);
  }

}