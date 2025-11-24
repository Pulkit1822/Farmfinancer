// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, BehaviorSubject } from 'rxjs';
// import { User } from '../models/user.model';
// import { Login } from '../models/login.model';
// import { tap } from 'rxjs/operators';
// import { environment } from 'src/environments/environment';
 
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
  
//   public baseUrl =environment.baseUrl;
 
//   private currentUserSubject: BehaviorSubject<User | null>;
//   public currentUser: Observable<User | null>;
 
//   constructor(private http: HttpClient) {
//     const storedUser = localStorage.getItem('currentUser');
//     this.currentUserSubject = new BehaviorSubject<User | null>(
//       storedUser ? JSON.parse(storedUser) : null
//     );
//     this.currentUser = this.currentUserSubject.asObservable();
//   }
 
//   public get currentUserValue(): User | null {
//     return this.currentUserSubject.value;
//   }
 
//   register(newUser: User): Observable<any> {
//     return this.http.post(`${this.baseUrl}/register`, newUser);  // Removed duplicate /api
//   }
 
//   login(loginData: Login): Observable<any> {
//     return this.http.post<{ token: string; User: User }>(`${this.baseUrl}/login`, loginData).pipe(
//       tap(response => {
//         const token = response.token;
//         const user = response.User;
 
//         if (token && user) {
//           localStorage.setItem('jwtToken', token);
//           localStorage.setItem('currentUser', JSON.stringify(user));
//           this.currentUserSubject.next(user);
//         }
//       })
//     );
//   }

 
//   isLoggedIn(): boolean {
//     return !!localStorage.getItem('jwtToken');
//   }
 
//   getUserRole(): string | null {
//     const user = this.currentUserValue;
//     return user ? user.UserRole : null;
//   }
 
//   getUserId(): number | null {
//     const user = this.currentUserValue;
//     return user ? user.UserId : null;
//   }
 
//   isAdmin(): boolean {
//     return this.getUserRole() === 'Admin';
//   }
 
//   isUser(): boolean {
//     return this.getUserRole() === 'User';
//   }
 
//   logout(): void {
//     localStorage.removeItem('jwtToken');
//     localStorage.removeItem('currentUser');
//     this.currentUserSubject.next(null);
//   }
 
//   getUserInfo(): { id: number, username: string } {
//     const user = this.currentUserValue;
//     return {
//       id: user ? user.UserId : 0,
//       username: user ? user.Username : ''
//     };
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { Login } from '../models/login.model';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public baseUrl = environment.baseUrl;

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

  private encodeData(data: any): string {
    return btoa(JSON.stringify(data)); // Base64 encoding
  }

  register(user: User): Observable<any> {
    const encodedUser = this.encodeData(user);
    return this.http.post(`${this.baseUrl}/register`, { data: encodedUser });
  }

  login(loginData: Login): Observable<any> {
    const encodedLogin = this.encodeData(loginData);
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, { data: encodedLogin }).pipe(
      tap(response => {
        const token = response.token;

        if (token) {
          localStorage.setItem('jwtToken', token);

          // Optional: If you later include user info in the response
          localStorage.setItem('currentUser', JSON.stringify(response.User));
          this.currentUserSubject.next(response.User);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  getUserRole(): string | null {
    const user = this.currentUserValue;
    return user ? user.UserRole : null;
  }

  getUserId(): number | null {
    const user = this.currentUserValue;
    return user ? user.UserId : null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'Admin';
  }

  isUser(): boolean {
    return this.getUserRole() === 'User';
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getUserInfo(): { id: number; username: string } {
    const user = this.currentUserValue;
    return {
      id: user ? user.UserId : 0,
      username: user ? user.Username : ''
    };
  }
}