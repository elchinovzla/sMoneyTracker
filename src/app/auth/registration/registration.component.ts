import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {}

  onRegisterUser(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    let defaultPassword = 'q1w2e3r4';
    this.authService.createUser(
      form.value.email,
      defaultPassword,
      form.value.firstName,
      form.value.lastName,
      form.value.isAdmin
    );
  }

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
