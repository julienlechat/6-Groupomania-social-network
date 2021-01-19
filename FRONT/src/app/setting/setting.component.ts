import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { SettingService } from '../services/setting.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})

export class SettingComponent implements OnInit {

  authSubscription!: Subscription;
  user?: any;

  uploadForm: FormGroup;
  imageURL?: string;
  
  constructor(public fb: FormBuilder, private auth: AuthService, private setting: SettingService, private router: Router) { 
    // Reactive Form
    this.uploadForm = this.fb.group({
      imgProfil: [null],
      description: [null],
      password: [null],
      password2: [null]
    })
  }

  ngOnInit(): void {
    this.authSubscription = this.auth.isAuth$.subscribe(
      (user) => {
        this.user = this.auth.getUser();
      }
    );

    console.log(this.user)
  }
  
  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

   // Image Preview
   showPreview(event: any) {
    const file = event.target.files[0];

    this.uploadForm.patchValue({
      imgProfil: file
    });
    this.uploadForm.get('imgProfil')?.updateValueAndValidity()
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

    // Submit Form
    submit(): void {
      var desc = this.uploadForm.get('description')?.value;
      var password = this.uploadForm.get('password')?.value;
      var password2 = this.uploadForm.get('password2')?.value;
      var img = this.uploadForm.get('imgProfil')?.value;

      if (password !== password2) return console.log('mot de passe different')
      //if (desc === this.user.description) desc = null
      
      // Envoie le statut et l'image au serveur
      this.setting.post(desc, password, img)
        .then(
          () => {
          // Actualiser la page
          window.location.reload();
          }
        )
        .catch(
          (err) => {
            console.log(err)
              //this.errorMsg = err
            }
        );
  
  
    }

}
