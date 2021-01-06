import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  errorMsg?: string;
  rememberme: Boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  remember(): void {
    this.rememberme === false ? this.rememberme = true : this.rememberme = false
  }

  onSubmit(): void {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    this.auth.loginUser(email, password, this.rememberme).then(
      () => {
        this.router.navigate(['/accueil']);
      }
    ).catch(
      (error) => {
        this.errorMsg = error.message;
      }
    );
  }

}
