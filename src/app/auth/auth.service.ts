import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACK_END_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private userId: string;
  private tokenTimer: any;
  private firstName = '';
  private lastName = '';
  private isAdmin: boolean;

  constructor(private http: HttpClient, private router: Router) {}

  createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    isAdmin: boolean
  ) {
    const authData: AuthData = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      isAdmin: isAdmin
    };
    this.http
      .post<{ message: string }>(BACK_END_URL + 'registration', authData)
      .subscribe(
        () => {
          this.router.navigate(['/dashboard']);
        },
        error => {
          this.authStatusListener.next(true);
        }
      );
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
      firstName: '',
      lastName: '',
      isAdmin: false
    };
    this.http
      .post<{
        token: string;
        expiresIn: number;
        userId: string;
        firstName: string;
        lastName: string;
        isAdmin: boolean;
      }>(BACK_END_URL + 'login', authData)
      .subscribe(
        response => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn * 1000;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.isAdmin = response.isAdmin;
            this.firstName = response.firstName;
            this.lastName = response.lastName;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration);
            this.saveAuthData(
              token,
              expirationDate,
              this.userId,
              this.firstName,
              this.lastName,
              this.isAdmin
            );
            this.router.navigate(['/dashboard']);
          }
        },
        error => {
          console.log(error);
          this.authStatusListener.next(false);
        }
      );
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.isAdmin = false;
    this.firstName = '';
    this.lastName = '';
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.isAdmin = authInformation.isAdmin.toLowerCase() === 'true';
      this.firstName = authInformation.firstName;
      this.lastName = authInformation.lastName;
      this.setAuthTimer(expiresIn);
      this.authStatusListener.next(true);
    }
  }

  getToken(): string {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth(): boolean {
    return this.isAuthenticated;
  }

  getUserId(): string {
    return this.userId;
  }

  getIsAdmin(): boolean {
    return this.isAdmin;
  }

  getUserName(): string {
    return (this.firstName.charAt(0) + this.lastName.charAt(0)).toUpperCase();
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string,
    firstName: string,
    lastName: string,
    isAdmin: boolean
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);
    localStorage.setItem('isAdmin', String(isAdmin));
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const isAdmin = localStorage.getItem('isAdmin');
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId,
      firstName,
      lastName,
      isAdmin
    };
  }
}
