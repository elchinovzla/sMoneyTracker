import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../user/user.model';
import { UserService } from '../../user/user.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss']
})
export class ProfileUpdateComponent implements OnInit, OnDestroy {
  public user: User;
  private authStatusSub: Subscription;
  public firstName: string;
  public lastName: string;
  public email: string;

  constructor(
    public activeModal: NgbActiveModal,
    public userService: UserService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe();
    this.firstName = this.authService.getFirstName();
    this.lastName = this.authService.getLastName();
    this.email = this.authService.getEmail();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onUpdateProfile(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.userService.updateProfile(
      this.authService.getUserId(),
      form.value.firstName,
      form.value.lastName,
      form.value.email,
      form.value.password
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
