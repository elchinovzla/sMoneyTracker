import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  userIsAuthentitcated: boolean;
  isUserAdmin: boolean;
  userName: string;
  collapedSideBar: boolean;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userIsAuthentitcated = this.authService.getIsAuth();
    this.userName = this.authService.getUserName();
    this.isUserAdmin = this.authService.getIsAdmin();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthentitcated = isAuthenticated;
        this.userName = this.authService.getUserName();
        if (this.authService.getIsAdmin()) {
          this.isUserAdmin =
            this.authService.getIsAdmin().toString() === 'true' ? true : false;
        } else {
          this.isUserAdmin = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  receiveCollapsed($event) {
    this.collapedSideBar = $event;
  }
}
