import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Profile } from '../models/Profile.model';
import { AuthService } from '../services/auth.service';
import { ActualityService } from '../services/actuality.service';
import { ProfileService } from '../services/profile.service'
import 'lg-zoom.js';
import 'lg-share.js';
import * as Bootstrap from 'bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  img_profil?: string;

  profileSub?: Subscription;
  profileId!: number;
  user: Profile[] = [];
  lg: any;

  alertId !: number;
  alertTitle?: string;
  alertContent?: string;
  alertElementId!: number;
  alertPostId!: number ;
  alertComId !: number;
  Modal : any;

  constructor(private route: ActivatedRoute, private router: Router, private profile: ProfileService, private Actuality: ActualityService, private auth: AuthService) { }

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
          (error) => {
            console.log(error);
          })
        this.profile.getProfileById(params.id);
      }
    )
  }
  
  ngOnDestroy(): void {
    if (this.profileSub) {
      this.profileSub.unsubscribe();
    }
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
              return
            }
            if (this.user[0].post[i].postId === idpost && res.statut === 0) {
              this.user[0].post[i].like -= 1;
              this.user[0].post[i].liked = 0;
              return
            }
            if (this.user[0].post[i].postId === idpost && res.statut === -1) {
              this.user[0].post[i].dislike -= 1;
              this.user[0].post[i].like += 1;
              this.user[0].post[i].liked = 1;
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
          if (!this.user[0].post) return
          for (let i=0; i<this.user[0].post.length; i++) {
            if (this.user[0].post[i].postId === idpost && res.statut === -1) {
              this.user[0].post[i].dislike += 1;
              this.user[0].post[i].liked = -1;
              return
            }
            if (this.user[0].post[i].postId === idpost && res.statut === 0) {
              this.user[0].post[i].dislike -= 1;
              this.user[0].post[i].liked = 0;
              return
            }
            if (this.user[0].post[i].postId === idpost && res.statut === 1) {
              this.user[0].post[i].dislike += 1;
              this.user[0].post[i].like -= 1;
              this.user[0].post[i].liked = -1;
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
          if (!this.user[0].post) return
          this.user[0].post[id] = {...this.user[0].post[id],...res}
          event.srcElement.children[0].children[0].children[1].value = null;
        }
      )
      .catch(
        (error) => {
          console.log(error)
      })
  }

  showDeletePost(element: any, postId: number, id:number):void {
    this.Modal = new Bootstrap.Modal(element)

    this.alertId = 1
    this.alertTitle = "Supprimer un post"
    this.alertContent = "Vous êtes sur le point de supprimer un post, êtes vous sûr ?"
    this.alertElementId = id
    this.alertPostId = postId

    this.Modal.show()
  }

  showDeleteCom(element: any, postId: number, id:number, comId: number):void {
    this.Modal = new Bootstrap.Modal(element)

    this.alertId = 2;
    this.alertTitle = "Supprimer un commentaire"
    this.alertContent = "Vous êtes sur le point de supprimer un commentaire, êtes vous sûr ?"
    this.alertElementId = id
    this.alertPostId = postId
    this.alertComId = comId

    this.Modal.show()
  }

  delete():void {
    // Supprimer un post
    if (this.alertId === 1) {
      this.Actuality.deletePost(this.alertPostId)
      .then(
        () => {
          if (!this.user[0].post) return
          this.user[0].post.splice(this.alertElementId, 1)
          for (let i=0; i<this.user[0].post.length; i++) {
            this.user[0].post[i].id = i
          }
        }
      )
      .catch(
        (error) => {
          console.log(error)
        }
      )
    }

    // Supprimer un commentaire
    if (this.alertId === 2) {
      this.Actuality.deleteCom(this.alertComId)
      .then(
        () => {
          if (!this.user[0].post) return
          var comment = this.user[0].post[this.alertPostId].comments
          comment?.splice(this.alertElementId, 1)

          if (comment) {
            for (let i=0; i<comment.length; i++) {
              comment[i].id = i
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
    
    if (this.Modal) this.Modal.hide()
  }



}
