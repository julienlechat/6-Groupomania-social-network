import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Profile } from '../models/Profile.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
  })

export class ProfileService {

  Profile$ = new Subject<Profile[]>();

    constructor(private http: HttpClient,
                private router: Router) {}

  getProfileById(id: number) {
    this.http.get<any>('http://localhost:3000/api/profile/' + id).subscribe(
        (profile: Profile[]) => {
        this.Profile$.next(profile);
      },
      () => this.Profile$.next([])
      );
  }

}