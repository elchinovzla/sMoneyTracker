import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

const BACK_END_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root' })
export class UserService {
  private users: User[] = [];
  private userUpdated = new Subject<{ users: User[]; userCount: number }>();
  private userStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getUsers(usersPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; users: any; maxUsers: number }>(
        BACK_END_URL + queryParams
      )
      .pipe(
        map(userData => {
          return {
            users: userData.users.map(user => {
              return {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
                isActive: user.isActive
              };
            }),
            maxUsers: userData.maxUsers
          };
        })
      )
      .subscribe(transformedUserData => {
        this.users = transformedUserData.users;
        this.userUpdated.next({
          users: [...this.users],
          userCount: transformedUserData.maxUsers
        });
      });
  }

  getUser(id: string) {
    return this.http.get<{
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      isAdmin: boolean;
      isActive: boolean;
    }>(BACK_END_URL + id);
  }

  getUserUpdateListener() {
    return this.userUpdated.asObservable();
  }

  getUserListener() {
    return this.userStatusListener.asObservable();
  }

  modifyUser(id: string, isAdmin: boolean, isActive: boolean) {
    const userData: User = {
      id: id,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      isAdmin: isAdmin,
      isActive: isActive
    };
    this.http
      .patch<{ message: string }>(BACK_END_URL + 'modify/' + id, userData)
      .subscribe(
        () => {
          this.router.navigate(['/user']);
        },
        error => {
          console.log(error);
          this.userStatusListener.next(true);
        }
      );
  }

  updateProfile(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    const userData: User = {
      id: id,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      isAdmin: false,
      isActive: false
    };
    this.http
      .patch<{ message: string }>(
        BACK_END_URL + 'profile/' + id,
        userData
      )
      .subscribe(
        () => {
          this.router.navigate(['/dashboard']);
        },
        error => {
          console.log(error);
          this.userStatusListener.next(true);
        }
      );
  }
}
