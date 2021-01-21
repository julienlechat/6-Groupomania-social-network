import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuth!: boolean;
  authSubscription!: Subscription;
  id_profil!: number;
  img_profil?: string;

  constructor(private auth: AuthService, public router:Router) { }

  ngOnInit(): void { 
    this.authSubscription = this.auth.isAuth$.subscribe(
      (auth) => {
        this.isAuth = auth;
        if (this.auth.getUser()) {
          this.id_profil = this.auth.getUser().userid;
          this.img_profil = this.auth.getUser().img_profil;
        }
      }
    );
  }

  homePage() {
    if (this.isAuth) {
      return ['/accueil']
    } else {
      return ['/login']
    }
  }

  viewProfil() {
    if (this.id_profil) {
      return ['/profile/' + this.id_profil]
    } else {
      return ['/']
    }
  }

  onLogout() {
    this.auth.logout();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

}