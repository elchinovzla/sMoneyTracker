import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public pushRightClass: string;
  private authListenerSubs: Subscription;
  userIsAuthentitcated: boolean;
  userName: string;

  constructor(private authService: AuthService, public router: Router) {
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
        this.toggleSidebar();
      }
    });
  }

  ngOnInit() {
    this.pushRightClass = 'push-right';
    this.userIsAuthentitcated = this.authService.getIsAuth();
    this.userName = this.authService.getUserName();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthentitcated = isAuthenticated;
        this.userName = this.authService.getUserName();
      });
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  onLoggedout() {
    this.authService.logout();
  }
}
