import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ViewChild
} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-nav',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.screenWidth = window.innerWidth;
  }
  @ViewChild('snav') sidenav: MatSidenav;
  private authListenerSubs: Subscription;
  userIsAuthentitcated = false;
  screenWidth: number;
  mobileQuery: MediaQueryList;

  fillerNav = Array.from({ length: 5 }, (_, i) => `Nav Item ${i + 1}`);

  private _mobileQueryListener: () => void;

  ngOnInit() {
    this.userIsAuthentitcated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthentitcated = isAuthenticated;
      });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.authListenerSubs.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 600) {
      this.sidenav.close();
    } else if (event.target.innerWidth > 840) {
      this.sidenav.open();
    }
  }

  onLogout() {
    this.authService.logout();
  }
}
