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


}
