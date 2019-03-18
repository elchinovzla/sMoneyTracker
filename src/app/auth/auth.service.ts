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
  private email = '';
  private isAdmin: boolean;
  private isActive: boolean;

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
      isAdmin: isAdmin,
      isActive: true
    };
    this.http
      .post<{ message: string }>(BACK_END_URL + 'registration', authData)
      .subscribe(
        () => {
          this.router.navigate(['/user']);
        },
        error => {
          console.log(error);
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
      isAdmin: false,
      isActive: false
    };
    this.http
      .post<{
        token: string;
        expiresIn: number;
        userId: string;
        firstName: string;
        lastName: string;
        email: string;
        isAdmin: boolean;
        isActive: boolean;
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
            this.isActive = response.isActive;
            this.firstName = response.firstName;
            this.lastName = response.lastName;
            this.email = response.email;
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
              this.email,
              this.isAdmin,
              this.isActive
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
    this.isActive = false;
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
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
      this.isActive = authInformation.isActive.toLowerCase() === 'true';
      this.firstName = authInformation.firstName;
      this.lastName = authInformation.lastName;
      this.email = authInformation.email;
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

  getIsActive(): boolean {
    return this.isActive;
  }

  getUserName(): string {
    return this.firstName + ' ' + this.lastName;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getEmail(): string {
    return this.email;
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
    email: string,
    isAdmin: boolean,
    isActive: boolean
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);
    localStorage.setItem('email', email);
    localStorage.setItem('isAdmin', String(isAdmin));
    localStorage.setItem('isActive', String(isActive));
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isActive');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('email');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const isAdmin = localStorage.getItem('isAdmin');
    const isActive = localStorage.getItem('isActive');
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const email = localStorage.getItem('email');

    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId,
      firstName,
      lastName,
      email,
      isAdmin,
      isActive
    };
  }
}
