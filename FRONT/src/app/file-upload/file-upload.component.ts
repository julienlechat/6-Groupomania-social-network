import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { PostStatut } from '../services/postStatut.service';
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


  constructor(public fb: FormBuilder,private postStatut: PostStatut,private router: Router) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      imgPost: [null],
      statut: [null]
    })
  }

  ngOnInit(): void {}

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
    let statut = this.uploadForm.get('statut')?.value;
    const user = localStorage.getItem('token') as string;
    let img = this.uploadForm.get('imgPost')?.value;


    if (img === null) img = 'none';
    if (statut === null || statut === '') statut = 'none';

    if (statut === 'none' && img === 'none') {
      this.errorMsg = "Votre publication est vide !";
      return
    }
    
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
        if (error.status === 400) {
          this.errorMsg = error.error.message;
        } else {
          this.errorMsg = error.message;
        }
        
      }
    );


  }

}