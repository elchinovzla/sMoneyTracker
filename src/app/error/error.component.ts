import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

interface Alert {
  type: string;
  message: string;
}

@Component({
  templateUrl: './error.component.html'
})
export class ErrorComponent {
  alerts: Alert[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {
    this.alerts = [{ type: 'danger', message: data.message }];
  }

  close(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }
}
