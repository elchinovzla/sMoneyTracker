import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-nav',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {
    this.screenWidth = window.innerWidth;
  }
  @ViewChild('snav') sidenav: MatSidenav;
  private authListenerSubs: Subscription;
  userIsAuthentitcated = false;
  screenWidth: number;

  ngOnInit() {
    this.userIsAuthentitcated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthentitcated = isAuthenticated;
      });
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
