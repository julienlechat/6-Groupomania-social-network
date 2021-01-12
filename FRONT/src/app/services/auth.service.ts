import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
  })

export class AuthService {

    isAuth$ = new BehaviorSubject<boolean>(false);
    private authToken?: string | null;
    private userId?: string;
    private img_profil?: string;

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

    getImgProfil() {
        return this.img_profil;
    }

    loginUser(email: string, password: string, rememberme: Boolean) {
        return new Promise<void>((resolve, reject) => {
          this.http.post('http://localhost:3000/api/auth/login', {email: email, password: password}).subscribe(
            (response: {userId?: string, img_profil?:string, token?: string}) => {
                this.userId = response.userId;
                this.img_profil = response.img_profil;
                this.authToken = response.token;
                if (rememberme === true) localStorage.setItem('token', response.token!);
                this.isAuth$.next(true);
                resolve();
            },
            (error) => {
                reject(error);
            }
            );
        });
    }

    isLogged(token: string | null) {
        return new Promise<void>((resolve, reject) => {
          this.http.post('http://localhost:3000/api/auth/islogged', {token: token}).subscribe(
            (response: {userId?: string, img_profil?:string}) => {
                this.userId = response.userId;
                this.img_profil = response.img_profil;
                this.authToken = localStorage.getItem('token');
                this.isAuth$.next(true);
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
        localStorage.removeItem('token');
        this.isAuth$.next(false);
        this.router.navigate(['login']);
    }

}