import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/User.model';

@Injectable({
    providedIn: 'root'
  })

export class AuthService {


    isAuth$ = new BehaviorSubject<boolean>(false);
    private authToken?: string | null;
    
    private userInfo: User = new User;


    constructor(private http: HttpClient,
                private router: Router) {}

    getToken() {
        return this.authToken;
    }
    getUser() {
        return this.userInfo;
    }

    createUser(email: string, password: string, lastname: string, firstname: string) {
        return new Promise((resolve, reject) => {
          this.http.post('http://localhost:3000/api/auth/signup', {email: email, password: password, lastname: lastname, firstname:firstname}).subscribe(
            (response: { message?: string }) => {
                resolve(response);
            },
            (error) => reject(error)
            );
        });
    }

    loginUser(email: string, password: string, rememberme: Boolean) {
        return new Promise<void>((resolve, reject) => {
          this.http.post<any>('http://localhost:3000/api/auth/login', {email: email, password: password, remember: rememberme}).subscribe(
            (response: {userinfo: any, token: string}) => {
                this.userInfo = response.userinfo;
                this.authToken = response.token;
                localStorage.setItem('token', response.token!);
                this.isAuth$.next(true);
                resolve();
            },
            (error) => reject(error)
            );
        });
    }

    isLogged() {
        return new Promise<void>((resolve, reject) => {
          this.http.get<any>('http://localhost:3000/api/auth/islogged').subscribe(
            (userinfo) => {
                this.userInfo = userinfo;
                this.authToken = localStorage.getItem('token');
                this.isAuth$.next(true);
                resolve();
            },
            () => reject(this.logout())
            );
        });
    }

    ctrlToken() {
        return new Promise<void>((resolve, reject) => {
          this.http.get('http://localhost:3000/api/auth/ctrlToken').subscribe(
            () => {
                this.isAuth$.next(true);
                resolve();
            },
            () =>  reject(this.logout())
            );
        });
    }

    deleteMyAccount() {
        return new Promise((resolve, reject) => {
          this.http.delete('http://localhost:3000/api/profile/delete').subscribe(
            (ok) => {
                this.logout()
                resolve(ok);
            },
            (err) =>  reject(err)
            );
        });
      }

    logout() {
        this.authToken = null!;
        this.userInfo = null!;
        localStorage.removeItem('token');
        this.isAuth$.next(false);
        this.router.navigate(['/login']);
    }

}