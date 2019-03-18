import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ProfileUpdateComponent } from '../profile-update/profile-update.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  userIsAuthentitcated: boolean;
  isUserAdmin: boolean;
  userName: string;
  isActive: boolean;
  collapsed: boolean;
  showMenu: string;
  pushRightClass: string;

  @Output() collapsedEvent = new EventEmitter<boolean>();

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    public router: Router
  ) {
    this.router.events.subscribe(val => {
      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 992 &&
        this.isToggled()
      ) {
        this.toggleSidebar();
      }
    });
  }

  ngOnInit() {
    this.userIsAuthentitcated = this.authService.getIsAuth();
    this.userName = this.authService.getUserName();
    this.isUserAdmin =
      this.authService.getIsAdmin().toString() === 'true' ? true : false;
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
    this.isActive = false;
    this.collapsed = false;
    this.showMenu = '';
    this.pushRightClass = 'push-right';
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  eventCalled() {
    this.isActive = !this.isActive;
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.collapsedEvent.emit(this.collapsed);
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

  openEditProfile() {
    this.modalService.open(ProfileUpdateComponent, {
      centered: true
    });
  }
}
