import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit(): void {

    if (localStorage.getItem('token')) {
      this.auth.isLogged()
        .then(() =>  this.router.navigate(['/accueil']))
        .catch(() => this.router.navigate(['/login']))
    }
  }
}