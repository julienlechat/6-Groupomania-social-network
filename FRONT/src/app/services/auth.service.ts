import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
  })

export class AuthService {

    isAuth$ = new BehaviorSubject<boolean>(false);
    private authToken?: string;
    private userId?: string;

    constructor(private http: HttpClient,
                private router: Router) {}

    createUser(email: string, password: string, lastname: string, firstname: string) {
        return new Promise((resolve, reject) => {
          this.http.post('http://localhost:3000/api/auth/signup', {email: email, password: password, lastname: lastname, firstname:firstname}).subscribe(
            (response: { message?: string }) => {
                resolve(response);
            },
            (error) => {
                reject(error);
            }
            );
        });
    }

    getToken() {
        return this.authToken;
      }
    
      getUserId() {
        return this.userId;
      }

    loginUser(email: string, password: string) {
        return new Promise((resolve, reject) => {
          this.http.post('http://localhost:3000/api/auth/login', {email: email, password: password}).subscribe(
            (response: {userId?: string, token?: string}) => {
                this.userId = response.userId;
                this.authToken = response.token;
                this.isAuth$.next(true);
                console.log(response)
                resolve();
            },
            (error) => {
                reject(error);
            }
            );
        });
    }

    logout() {
        this.authToken = null!;
        this.userId = null!;
        this.isAuth$.next(false);
        this.router.navigate(['login']);
    }

}