import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = () => {
      if (this.auth.getToken() !== undefined) return this.auth.getToken()
      return localStorage.getItem('token')
    }
    
    const newRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken())
    });
    return next.handle(newRequest);
  }
}