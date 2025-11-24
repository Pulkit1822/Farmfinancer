import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
 
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
 
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
 
    const isLoggedIn = this.authService.isLoggedIn();
    const userRole = this.authService.getUserRole();
    const url = state.url;
 
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }
 
    if (url.startsWith('/admin') && userRole !== 'Admin') {
      this.router.navigate(['/home']);
      return false;
    }
 
    if (url.startsWith('/user') && userRole !== 'User') {
      this.router.navigate(['/home']);
      return false;
    }
 
    return true;
  }
}
 
