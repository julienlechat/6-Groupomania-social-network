import { Component, OnInit } from '@angular/core';
import { ActualityService } from '../services/actuality.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { Actuality } from '../models/Actuality.model';
import 'lg-zoom.js';
import 'lg-share.js';

@Component({
  selector: 'app-actuality',
  templateUrl: './actuality.component.html',
  styleUrls: ['./actuality.component.css']
})

export class ActualityComponent implements OnInit {
  
  actualitySub?: Subscription;
  actus: Actuality[] = [];
  lg: any;
  img_profil?: string;

  constructor(private Actuality: ActualityService, private auth: AuthService) { }


  ngOnInit(): void {
    this.img_profil = this.auth.getImgProfil();
    this.actualitySub = this.Actuality.Actuality$.subscribe(
      (actus) => {
        console.log(actus)
        this.actus = actus;
      },
      (error) => {
        console.log(error);
      }
    );
    this.Actuality.getActuality();
  }

  viewPicture(event: any): void {
    this.lg = event.srcElement
    lightGallery(this.lg, {
      dynamic: true,
      share: false,
      zoom: false,
      download: false,
      dynamicEl: [{
        src: event.srcElement.src
      }]
    });
  }

  likePost(idpost: number): void {
    this.Actuality.likePost(idpost)
      .then(
        (res: any) => {
          for (let i=0; i<this.actus.length; i++) {
            if (this.actus[i].postId === idpost && res.statut === 1) {
              this.actus[i].like += 1;
              this.actus[i].liked = 1;
              return
            }
            if (this.actus[i].postId === idpost && res.statut === 0) {
              this.actus[i].like -= 1;
              this.actus[i].liked = 0;
              return
            }
            if (this.actus[i].postId === idpost && res.statut === -1) {
              this.actus[i].dislike -= 1;
              this.actus[i].like += 1;
              this.actus[i].liked = 1;
              return
            }
          }
        }
      )
      .catch(
        (error) => {
            console.log(error)
        }
      )
  }

  dislikePost(idpost: number): void {
    this.Actuality.dislikePost(idpost)
      .then(
        (res: any) => {
          for (let i=0; i<this.actus.length; i++) {
            if (this.actus[i].postId === idpost && res.statut === -1) {
              this.actus[i].dislike += 1;
              this.actus[i].liked = -1;
              return
            }
            if (this.actus[i].postId === idpost && res.statut === 0) {
              this.actus[i].dislike -= 1;
              this.actus[i].liked = 0;
              return
            }
            if (this.actus[i].postId === idpost && res.statut === 1) {
              this.actus[i].dislike += 1;
              this.actus[i].like -= 1;
              this.actus[i].liked = -1;
              return
            }
          }
        }
      )
      .catch(
        (error) => {
            console.log(error)
      })
  }

  addComment(event: any, idPost: number, id: number):void {
    var text = event.srcElement.children[0].children[0].children[1].value;

    this.Actuality.addComment(idPost, text)
      .then(
        (res: any) => {
          console.log(res)
          this.actus[id] = {...this.actus[id],...res}
          event.srcElement.children[0].children[0].children[1].value = null;
        }
      )
      .catch(
        (error) => {
          console.log(error)
      })
  }

  deletePost(idpost?: number):void {
    console.log('delete ' + idpost)
  }


}
