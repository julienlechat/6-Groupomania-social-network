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
      () => this.Actuality$.next([])
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
          (error) =>  reject(error)
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
          (error) =>  reject(error)
      );
    });
  }

  addComment(idPost: number, msg: String) {
    return new Promise((resolve, reject) => {
      this.http.post(
        'http://localhost:3000/api/actuality/addComment',
        {
          idPost: idPost,
          msg: msg
        })
        .subscribe(
          (response: { comments?: any }) => {
            resolve(response);
          },
          (error) => reject(error)
      );
    });
  }

  deletePost(idPost: number) {
    return new Promise((resolve, reject) => {
      this.http.delete(
        'http://localhost:3000/api/actuality/delete/post/' + idPost)
        .subscribe(
          (res: { message?: string }) => {
            resolve(res);
          },
          (error) => reject(error)
      );
    });
  }

  deleteCom(idCom: number) {
    return new Promise((resolve, reject) => {
      this.http.delete(
        'http://localhost:3000/api/actuality/delete/coment/' + idCom)
        .subscribe(
          (res: { message?: string }) => {
            resolve(res);
          },
          (error) => reject(error)
      );
    });
  }

  linkProfile(id: number) {
    return ['/profile/' + id]
  }

  userDeleteCom(userId: number):Boolean {
    if (this.auth.getUser().role === 1 || this.auth.getUser().userid === userId) return true
    return false
  }


}
