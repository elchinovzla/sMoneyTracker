import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit, OnDestroy {
  user: User;

  private authStatusSub: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onCreateUser(form: NgForm) {
    if (form.invalid) {
      return;
    }
    let defaultPassword =
      Math.random()
        .toString(36)
        .substring(2, 8) +
      Math.random()
        .toString(36)
        .substring(2, 8);

    this.authService.createUser(
      form.value.email.toLowerCase(),
      defaultPassword,
      form.value.firstName,
      form.value.lastName,
      form.value.isUserAdmin.toString() === 'true' ? true : false
    );

    this.activeModal.close();
  }

  onClose() {
    this.activeModal.close();
  }

  onDismiss() {
    this.activeModal.dismiss();
  }
}
