import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  errorMsg?: string;
  rememberme: Boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  constructor(private auth: AuthService,
              private router: Router, private error: ErrorService) { }


  remember(): void {
    this.rememberme === false ? this.rememberme = true : this.rememberme = false
  }

  onSubmit(): void {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    
    this.auth.loginUser(email, password, this.rememberme)
      .then(() =>  this.router.navigate(['/accueil']))
      .catch((err) => this.error.setMsg(err.error));
  }

}
