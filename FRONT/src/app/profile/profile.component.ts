import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Profile } from '../models/Profile.model';
import { AuthService } from '../services/auth.service';
import { ActualityService } from '../services/actuality.service';
import { ProfileService } from '../services/profile.service'
import 'lg-zoom.js';
import 'lg-share.js';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
@Injectable({
  providedIn: 'root'
})

export class ProfileComponent implements OnInit {

  img_profil?: string;

  profileSub?: Subscription;
  profileId!: number;
  user: Profile[] = [];
  lg: any;

  constructor(private route: ActivatedRoute, private router: Router, private profile: ProfileService, public Actuality: ActualityService, private auth: AuthService, private error: ErrorService) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params) => {
        this.img_profil = this.auth.getUser().img_profil;
        var id: number = +params.id;
        this.profileId = id
        this.profileSub = this.profile.Profile$.subscribe(
          (user) => {
            this.user = user
            this.editable()
          },
          (err) => this.error.setMsg(err.error))
        this.profile.getProfileById(params.id);
      }
    )
  }
  
  ngOnDestroy(): void {
    this.profileSub?.unsubscribe();
  }
  
  editable() {
    if (this.user[0].post) {
      if (this.auth.getUser().role === 1 || this.auth.getUser().userid === this.profileId){
        this.user[0].editable = true;
      } else {
        this.user[0].editable = false;
      }
    }
  }

  linkProfile(id: number) {
    return this.Actuality.linkProfile(id)
  }

  userDeleteCom(userId: number):Boolean {
    return this.Actuality.userDeleteCom(userId);
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
          if (!this.user[0].post) return
          for (let i=0; i<this.user[0].post.length; i++) {
            if (this.user[0].post[i].postId === idpost && res.statut === 1) {
              this.user[0].post[i].like += 1;
              this.user[0].post[i].liked = 1;
            }
            if (this.user[0].post[i].postId === idpost && res.statut === 0) {
              this.user[0].post[i].like -= 1;
              this.user[0].post[i].liked = 0;
            }
            if (this.user[0].post[i].postId === idpost && res.statut === -1) {
              this.user[0].post[i].dislike -= 1;
              this.user[0].post[i].like += 1;
              this.user[0].post[i].liked = 1;
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
          if (!this.user[0].post) return
          for (let i=0; i<this.user[0].post.length; i++) {
            if (this.user[0].post[i].postId === idpost && res.statut === -1) {
              this.user[0].post[i].dislike += 1;
              this.user[0].post[i].liked = -1;
            }
            if (this.user[0].post[i].postId === idpost && res.statut === 0) {
              this.user[0].post[i].dislike -= 1;
              this.user[0].post[i].liked = 0;
            }
            if (this.user[0].post[i].postId === idpost && res.statut === 1) {
              this.user[0].post[i].dislike += 1;
              this.user[0].post[i].like -= 1;
              this.user[0].post[i].liked = -1;
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
          console.log(res)
          if (!this.user[0].post) return
          this.user[0].post[id] = {...this.user[0].post[id],...res}
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
      source: 2
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
      source: 2
    }
    this.error.setAlert(AlertSend)
  }

  delete(id: number, ElemId: number, postId?: number) {
    if (!postId) postId = 0
    // Supprimer un post
   if (id === 1) {
    if (!this.user[0].post) return
    this.user[0].post?.splice(ElemId, 1)
    for (let i=0; i<this.user[0].post.length; i++) {
      this.user[0].post[i].id = i
    }
   }
  // Supprimer un commentaire
  if (id === 2) {
    if (!this.user[0].post) return
    var comment = this.user[0].post[postId].comments
    comment?.splice(ElemId, 1)

    if (comment) {
      for (let i=0; i<comment.length; i++) {
        comment[i].id = i
      }
    }
  }
}
}
