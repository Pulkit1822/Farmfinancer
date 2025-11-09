import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { Login } from '../models/login.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://8080-decdbdbfbbdcdbdafdeaaabcfdceffaacaaae.premiumproject.examly.io/api';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(newUser: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, newUser);
  }

  login(loginUser: Login): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginUser).pipe(
      tap(response => {
        const user = response.User;
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user?.UserRole === 'Admin';
  }

  isUser(): boolean {
    const user = this.currentUserValue;
    return user?.UserRole === 'User';
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}