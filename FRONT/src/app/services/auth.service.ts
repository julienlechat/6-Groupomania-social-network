import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
  })

export class AuthService {

    isAuth$ = new BehaviorSubject<boolean>(false);
    private authToken?: string | null;
    private userId?: number;
    private userRole?: number;
    private img_profil?: string;

    constructor(private http: HttpClient,
                private router: Router) {}

    getToken() {
        return this.authToken;
    }
    getUserId() {
        return this.userId;
    }
    getUserRole() {
        return this.userRole;
    }
    getImgProfil() {
        return this.img_profil;
    }

    createUser(email: string, password: string, lastname: string, firstname: string) {
        return new Promise((resolve, reject) => {
          this.http.post('http://localhost:3000/api/auth/signup', {email: email, password: password, lastname: lastname, firstname:firstname}).subscribe(
            (response: { message?: string }) => {
                resolve(response);
            },
            (error) => {
                console.log(error)
                reject(error);
            }
            );
        });
    }

    loginUser(email: string, password: string, rememberme: Boolean) {
        return new Promise<void>((resolve, reject) => {
          this.http.post('http://localhost:3000/api/auth/login', {email: email, password: password}).subscribe(
            (response: {userId?: number, img_profil?:string, role?: number, token?: string}) => {
                this.userId = response.userId;
                this.img_profil = response.img_profil;
                this.authToken = response.token;
                this.userRole = response.role;
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
        return new Promise((resolve, reject) => {
            let headers = new HttpHeaders()
                .set('Authorization', 'Bearer lol' + localStorage.getItem('token'))

          this.http.post('http://localhost:3000/api/auth/islogged',  null).subscribe(
            (response: {userId?: number, role?: number, img_profil?:string}) => {
                this.userId = response.userId;
                this.img_profil = response.img_profil;
                this.authToken = localStorage.getItem('token');
                this.userRole = response.role;
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