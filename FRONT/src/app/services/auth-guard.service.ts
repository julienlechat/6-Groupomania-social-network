import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService,
              private router: Router) {}

  canActivate(): Observable<boolean> {
    return new Observable(
      (observer) => {
        this.auth.isAuth$.subscribe(
          (auth) => {
            if (auth) {
              observer.next(true);
            } else {
              this.router.navigate(['/login']);
            }
          }
        );
        if (localStorage.getItem('token')) this.auth.ctrlToken()
      }
    );
  }
}
