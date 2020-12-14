import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  errorMsg!: string;

  signupForm = new FormGroup({
    lastname: new FormControl('', [Validators.required, Validators.min(3), Validators.max(20)]),
    firstname: new FormControl('', [Validators.required, Validators.min(3), Validators.max(20)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.min(8)]),
    password2: new FormControl('', [Validators.required, Validators.min(8)])
  });

  constructor(private auth: AuthService) { }

  ngOnInit(): void {  }

   onSubmit(): void {
    const lastname = this.signupForm.get('lastname')?.value;
    const firstname = this.signupForm.get('firstname')?.value;
    const email = this.signupForm.get('email')?.value;
    const password = this.signupForm.get('password')?.value;
    const password2 = this.signupForm.get('password2')?.value;

    if (password === password2) {

      this.auth.createUser(email, password, lastname, firstname)
      .then(
        (success) => {
          console.log(success);
        })
      .catch(
        (error) => {
          if (error.error.error.code && error.error.error.code === "ER_DUP_ENTRY") {this.errorMsg = "L'adresse email est déjà utilisé !"}
          else if (error.error.error) {this.errorMsg = error.error.error}
          else {this.errorMsg = error.message};
          console.error(error);
        }
      )

    } else {
      this.errorMsg = "Mot de passe non identique";
    }

   }


}
