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

  updateUser(id: string, title: string, content: string, image: File | string) {
    // let postData: Post | FormData;
    // if (typeof image === 'object') {
    //   postData = new FormData();
    //   postData.append('id', id);
    //   postData.append('title', title);
    //   postData.append('content', content);
    //   postData.append('image', image, title);
    // } else {
    //   postData = {
    //     id: id,
    //     title: title,
    //     content: content,
    //     imagePath: image,
    //     creator: null
    //   };
    // }
    // this.http.put(BACK_END_URL + id, postData).subscribe(() => {
    //   this.router.navigate(['/']);
    // });
  }

  deleteUser(userId: string) {
    return this.http.delete(BACK_END_URL + userId);
  }
}
