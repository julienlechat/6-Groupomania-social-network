import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Actuality } from '../models/Actuality.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ActualityService {

  Actuality$ = new Subject<Actuality[]>();


  constructor(private http: HttpClient,
              private auth: AuthService) {}

  getActuality() {
    this.http.get<any>('http://localhost:3000/api/actuality/actus').subscribe(
        (actus: Actuality[]) => {
        this.Actuality$.next(actus);
      },
      (error) => {
        this.Actuality$.next([]);
        console.error(error);
      }
    );
  }

  likePost(idPost: number) {
    return new Promise((resolve, reject) => {
      this.http.post(
        'http://localhost:3000/api/actuality/like',
        {
          idPost: idPost
        })
        .subscribe(
          (response: { statut?: number }) => {
            resolve(response);
          },
          (error) => {
            reject(error);
        }
      );
    });
  }

  dislikePost(idPost: number) {
    return new Promise((resolve, reject) => {
      this.http.post(
        'http://localhost:3000/api/actuality/dislike',
        {
          idPost: idPost
        })
        .subscribe(
          (response: { statut?: number }) => {
            resolve(response);
          },
          (error) => {
            reject(error);
        }
      );
    });
  }


}
