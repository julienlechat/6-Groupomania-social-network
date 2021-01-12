import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuth!: boolean;
  authSubscription!: Subscription;
  img_profil?: string;

  constructor(private auth: AuthService) { }

  ngOnInit(): void { 
    this.authSubscription = this.auth.isAuth$.subscribe(
      (auth) => {
        this.isAuth = auth;
        this.img_profil = this.auth.getImgProfil();
      }
    );
}

onLogout() {
  this.auth.logout();
}

ngOnDestroy() {
  this.authSubscription.unsubscribe();
}

}