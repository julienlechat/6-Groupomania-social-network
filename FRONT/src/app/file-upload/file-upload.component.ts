import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { PostStatut } from './postStatut';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})

export class FileUploadComponent implements OnInit {

  errorMsg?: string;
  imageURL?: string;
  uploadForm: FormGroup;


  constructor(public fb: FormBuilder,private postStatut: PostStatut) {
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
    

    this.postStatut.post(statut, img).then(
      () => {
        console.log("j'envoie au serveur")
      }
    )
    //.catch(
      //(error) => {
        //console.log(error.message)
        //this.errorMsg = error.message;
     // }
    //);


  }

}