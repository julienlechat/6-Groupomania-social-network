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

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    this.auth.loginUser(email, password).then(
      () => {
        console.log('je suis co gros')
        this.router.navigate(['/accueil']);
      }
    ).catch(
      (error) => {
        this.errorMsg = error.message;
      }
    );
  }

}
