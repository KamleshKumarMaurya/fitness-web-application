import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  password?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: 'USER' | 'ADMIN';
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_URL = 'http://localhost:8080/api/auth-service/auth/login';
  private readonly REGISTER_URL = 'http://localhost:8080/api/user-service/api/users/register';

  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr && userStr !== 'undefined' && userStr !== 'null') {
      try {
        this.currentUser.set(JSON.parse(userStr));
        this.isAuthenticated.set(true);
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        this.logout();
      }
    }
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.AUTH_URL, credentials).pipe(
      tap(res => {
        const user: User = {
          email: res.email,
          role: res.role,
          id: res.userId,
          firstName: res.email.split('@')[0], // Fallback name from email
          lastName: ''
        };
        debugger
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      })
    );
  }

  register(userData: User): Observable<any> {
    return this.http.post(this.REGISTER_URL, userData);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
