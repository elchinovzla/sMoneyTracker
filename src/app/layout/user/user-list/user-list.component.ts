import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../user.model';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  totalUsers = 0;
  usersPerPage = 10;
  currentPage = 1;
  private userSub: Subscription;

  constructor(public userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers(this.usersPerPage, this.currentPage);
    this.userSub = this.userService
      .getUserUpdateListener()
      .subscribe((userData: { users: User[]; userCount: number }) => {
        this.users = userData.users;
        this.totalUsers = userData.userCount;
      });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.usersPerPage = pageData.pageSize;
    this.userService.getUsers(this.usersPerPage, this.currentPage);
  }
}
