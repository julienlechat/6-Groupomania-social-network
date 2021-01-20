import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { PostStatut } from '../../services/postStatut.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css'],
})

export class publishComponent implements OnInit {

  imageURL?: string;
  uploadForm: FormGroup;
  img_profil?: string;
  errorMsg?: string;


  constructor(public fb: FormBuilder, private postStatut: PostStatut ,private router: Router, private auth: AuthService, public error: ErrorService) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      imgPost: [null],
      statut: [null]
    })
  }

  ngOnInit(): void {
    this.img_profil = this.auth.getUser().img_profil;
  }

  // Image Preview
  showPreview(event: any) {
    const file = event.target.files[0];

    this.uploadForm.patchValue({
      imgPost: file
    });
    this.uploadForm.get('imgPost')?.updateValueAndValidity()
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  // Submit Form
  submit(): void {
    var statut = this.uploadForm.get('statut')?.value;
    var img = this.uploadForm.get('imgPost')?.value;
    
    // Envoie le statut et l'image au serveur
    this.postStatut.post(statut, img)
      .then(() => {
        // Actualiser la page
        let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
        })
      .catch((err) => this.error.setMsg(err.error));


  }

}