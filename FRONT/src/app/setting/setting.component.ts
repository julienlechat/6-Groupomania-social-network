import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { SettingService } from '../services/setting.service';
import { Router } from '@angular/router';
import { ErrorService } from '../services/error.service';

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
  
  constructor(public fb: FormBuilder, private auth: AuthService, private setting: SettingService, private router: Router, private error: ErrorService) { 
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
      () => this.user = this.auth.getUser()
    );
  }
  
  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  showDeleteCompte():void {
    const AlertSend = {
      id: 3,
      title: "Supprimer votre compte",
      content: "Vous êtes sur le point de supprimer votre compte, êtes vous sûr ?<br /> Ceci est irréversible !!",
      elementId: 0,
      postId: 0,
      comId: 0,
      buttonType: 1,
      buttonText: 'Supprimer mon compte',
      source: 0
    }
    this.error.setAlert(AlertSend)
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

      if (password !== password2) return this.error.setMsg('Les mots de passes sont différent')
      
      // Envoie le statut et l'image au serveur
      this.setting.post(desc, password, img)
        .then(() => window.location.reload())
        .catch((err) => this.error.setMsg(err.error))
    }

}
