import { Component, Injectable, OnInit } from '@angular/core';
import { ActualityService } from '../services/actuality.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { Actuality } from '../models/Actuality.model';
import 'lg-zoom.js';
import 'lg-share.js';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-actuality',
  templateUrl: './actuality.component.html',
  styleUrls: ['./actuality.component.css']
})
@Injectable({
  providedIn: 'root'
})

export class ActualityComponent implements OnInit {
  
  actualitySub?: Subscription;
  actus: Actuality[] = [];
  lg: any;
  img_profil?: string;

  constructor(public Actuality: ActualityService,
              private auth: AuthService, private error: ErrorService) { }


  ngOnInit(): void {
    this.ngOnDestroy()
    this.img_profil = this.auth.getUser().img_profil;
    this.actualitySub = this.Actuality.Actuality$.subscribe(
      (actus) => this.actus = actus,
      (error) => this.error.setMsg(error.error)
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
  
  ngOnDestroy(): void {
    if (this.actualitySub) {
      this.actualitySub.unsubscribe();
    }
  }

  userDeleteCom(userId: number):Boolean {
    return this.Actuality.userDeleteCom(userId);
  }

  likePost(idpost: number): void {
    this.Actuality.likePost(idpost)
      .then(
        (res: any) => {
          for (let i=0; i<this.actus.length; i++) {
            if (this.actus[i].postId === idpost && res.statut === 1) {
              this.actus[i].like += 1;
              this.actus[i].liked = 1;
            }
            if (this.actus[i].postId === idpost && res.statut === 0) {
              this.actus[i].like -= 1;
              this.actus[i].liked = 0;
            }
            if (this.actus[i].postId === idpost && res.statut === -1) {
              this.actus[i].dislike -= 1;
              this.actus[i].like += 1;
              this.actus[i].liked = 1;
            }
          }
          return
        }
      )
      .catch((err) => this.error.setMsg(err.error))
  }

  dislikePost(idpost: number): void {
    this.Actuality.dislikePost(idpost)
      .then(
        (res: any) => {
          for (let i=0; i<this.actus.length; i++) {
            if (this.actus[i].postId === idpost && res.statut === -1) {
              this.actus[i].dislike += 1;
              this.actus[i].liked = -1;
            }
            if (this.actus[i].postId === idpost && res.statut === 0) {
              this.actus[i].dislike -= 1;
              this.actus[i].liked = 0;
            }
            if (this.actus[i].postId === idpost && res.statut === 1) {
              this.actus[i].dislike += 1;
              this.actus[i].like -= 1;
              this.actus[i].liked = -1;
            }
          }
          return
        }
      )
      .catch((err) => this.error.setMsg(err.error))
  }

  addComment(event: any, idPost: number, id: number):void {
    var text = event.srcElement.children[0].children[0].children[1].value;

    this.Actuality.addComment(idPost, text)
      .then(
        (res: any) => {
          this.actus[id] = {...this.actus[id],...res}
          event.srcElement.children[0].children[0].children[1].value = null;
        }
      )
      .catch((err) => this.error.setMsg(err.error))
  }

  showDeletePost(postId: number, id:number):void {
    const AlertSend = {
      id: 1,
      title: "Supprimer un post",
      content: "Vous êtes sur le point de supprimer un post, êtes vous sûr ?",
      elementId: id,
      postId: postId,
      comId: 0,
      buttonType: 1,
      buttonText: 'Supprimer',
      source: 1
    }
    this.error.setAlert(AlertSend)
  }

  showDeleteCom(postId: number, id:number, commentId: number):void {
    const AlertSend = {
      id: 2,
      title: "Supprimer un commentaire",
      content: "Vous êtes sur le point de supprimer un commentaire, êtes vous sûr ?",
      elementId: id,
      postId: postId,
      comId: commentId,
      buttonType: 1,
      buttonText: 'Supprimer',
      source: 1
    }
    this.error.setAlert(AlertSend)
  }

  delete(id: number, ElemId: number, postId?: number):void {
    if (!postId) postId = 0
    // Supprimer un post
   if (id === 1) {
    this.actus.splice(ElemId, 1)
    for (let i=0; i<this.actus.length; i++) {
      this.actus[i].id = i
    }
   }
    // Supprimer un commentaire
    if (id === 2) {
      var comment = this.actus[postId].comments
      comment?.splice(ElemId, 1)

      if (comment) {
        for (let i=0; i<comment.length; i++) {
          comment[i].id = i
        }
      }
    }
  }
}
