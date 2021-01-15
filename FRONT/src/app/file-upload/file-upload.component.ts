import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { PostStatut } from '../services/postStatut.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})

export class FileUploadComponent implements OnInit {

  errorMsg?: string;
  imageURL?: string;
  uploadForm: FormGroup;

  img_profil?: string;


  constructor(public fb: FormBuilder,private postStatut: PostStatut,private router: Router, private auth: AuthService) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      imgPost: [null],
      statut: [null]
    })
  }

  ngOnInit(): void {
    this.img_profil = this.auth.getImgProfil();
  }

  suprAlert() {
    this.errorMsg = undefined
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
    this.postStatut.post(statut, img).then(
      () => {
      // Actualiser la page
      let currentUrl = this.router.url;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([currentUrl]);
      }
    )
    .catch(
      (error) => {
          this.errorMsg = error;
        }
    );


  }

}