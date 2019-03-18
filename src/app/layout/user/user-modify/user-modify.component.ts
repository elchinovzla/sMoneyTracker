import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { User } from '../user.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-modify',
  templateUrl: './user-modify.component.html',
  styleUrls: ['./user-modify.component.scss']
})
export class UserModifyComponent implements OnInit, OnDestroy {
  public user: User;
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

  onModifyUser(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.userService.modifyUser(
      this.user.id,
      form.value.isUserAdmin.toString() === 'true' ? true : false,
      form.value.isUserActive.toString() === 'true' ? true : false
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
