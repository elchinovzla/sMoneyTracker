import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BACK_END_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root' })
export class UserService {
  // private posts: Post[] = [];
  // private postUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getUsers(usersPerPage: number, currentPage: number) {
    // const queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;
    // this.http
    //   .get<{ message: string; posts: any; maxPosts: number }>(
    //     BACK_END_URL + queryParams
    //   )
    //   .pipe(
    //     map(postData => {
    //       return {
    //         posts: postData.posts.map(post => {
    //           return {
    //             title: post.title,
    //             content: post.content,
    //             id: post._id,
    //             imagePath: post.imagePath,
    //             creator: post.creator
    //           };
    //         }),
    //         maxPosts: postData.maxPosts
    //       };
    //     })
    //   )
    //   .subscribe(transformedPostData => {
    //     this.posts = transformedPostData.posts;
    //     this.postUpdated.next({
    //       posts: [...this.posts],
    //       postCount: transformedPostData.maxPosts
    //     });
    //   });
  }

  getUser(id: string) {
    // return this.http.get<{
    //   _id: string;
    //   title: string;
    //   content: string;
    //   imagePath: string;
    //   creator: string;
    // }>(BACK_END_URL + id);
  }

  getUserUpdateListener() {
    // return this.postUpdated.asObservable();
  }

  addUser(firstName: string, lastName: string, email: string, password: string, isAdmin: boolean) {
    // const userData = new FormData();
    // userData.append('firstName', firstName);
    // userData.append('lastName', lastName);
    // userData.append('email', email);
    // userData.append('password', password);
    // userData.append('isAdmin', isAdmin.toString());
    // this.http
    //   .post<{ message: string; user: User }>(BACK_END_URL, userData)
    //   .subscribe(() => {
    //     this.router.navigate(['/user']);
    //   });
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
