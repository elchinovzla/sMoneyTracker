import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-nav',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {
  @ViewChild('snav') sidenav: MatSidenav;
  private authListenerSubs: Subscription;
  userIsAuthentitcated: boolean;
  isUserAdmin: boolean;
  userName: string;
  screenWidth: number;

  constructor(private authService: AuthService) {
    this.screenWidth = window.innerWidth;
  }

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
          this.isUserAdmin = this.authService.getIsAdmin().toString() === 'true' ? true : false;
        } else {
          this.isUserAdmin = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
