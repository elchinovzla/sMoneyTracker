import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/layout/user/user.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit, OnDestroy {
  private userStatusSub: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.userStatusSub = this.userService.getUserListener().subscribe();
  }

  ngOnDestroy() {
    this.userStatusSub.unsubscribe();
  }

  onRecoverPassword(form: NgForm) {
    if (form.invalid) {
      return;
    }

    let randomPassword =
      Math.random()
        .toString(36)
        .substring(2, 8) +
      Math.random()
        .toString(36)
        .substring(2, 8);

    this.userService.recoverPassword(
      form.value.email,
      randomPassword
    );

    this.activeModal.dismiss();
  }

  onClose() {
    this.activeModal.close();
  }

  onDismiss() {
    this.activeModal.dismiss();
  }
}
