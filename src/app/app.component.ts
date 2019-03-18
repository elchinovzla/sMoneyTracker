import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'sMoneyTracker';

  constructor(private authService: AuthService, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };

    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit() {
    this.authService.autoAuthUser();
  }
}
