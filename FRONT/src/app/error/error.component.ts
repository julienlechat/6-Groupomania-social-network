import { OnInit, Component, ViewChild, ElementRef } from '@angular/core';
import { ErrorService } from '../services/error.service';
import { Alert } from '../models/Alert.model';
import * as Bootstrap from 'bootstrap';
import { Subscription } from 'rxjs';
import { ActualityService } from '../services/actuality.service';
import { ActualityComponent } from '../actuality/actuality.component';
import { ProfileComponent } from '../profile/profile.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})

export class ErrorComponent implements OnInit {
  errorMsg ?: string;
  alertMsg?: Alert;
  Modal : any;

  errorSub?: Subscription;
  alertSub?: Subscription;

  @ViewChild('alertElement') alertElement?:ElementRef;

  constructor(private error: ErrorService, private Actu: ActualityComponent,
              private Actuality: ActualityService, private Profile: ProfileComponent,
              private auth: AuthService) { }

  ngOnInit(): void { 

    this.errorSub = this.error.cast.subscribe(msg => this.errorMsg = msg)

    this.alertSub = this.error.alertCast.subscribe(Alert => {
      this.alertMsg = Alert;
      this.Modal = new Bootstrap.Modal(this.alertElement?.nativeElement)
      this.Modal.show()
    })

  }

  removeError(): void {
    this.error.setMsg('')
    this.errorMsg = undefined;
  }

  ngOnDestroy(): void {
    this.errorSub?.unsubscribe();
    this.alertSub?.unsubscribe();
  }

  // Action de suppression via une Alert
  delete():void {

    //Supprime un post
    if (this.alertMsg?.id === 1) {
      var elemId = this.alertMsg.elementId
      this.Actuality.deletePost(this.alertMsg.postId)
        .then(() => {
          if (this.alertMsg?.source === 1){
            this.Actu.delete(1, elemId)
          } else {
            this.Profile.delete(1, elemId)
          }
        })
        .catch((err) => this.error.setMsg(err.error))
    }

    //supprime un commentaire
    if (this.alertMsg?.id === 2) {
      var elemId = this.alertMsg.elementId
      var postId = this.alertMsg.postId

      this.Actuality.deleteCom(this.alertMsg.comId)
        .then(() => {
          if (this.alertMsg?.source === 1){
            this.Actu.delete(2, elemId, postId)
          } else {
            this.Profile.delete(2, elemId, postId)
          }
        })
        .catch((err) => this.error.setMsg(err.error))
    }

    if (this.alertMsg?.id === 3) {
      this.auth.deleteMyAccount()
      .catch((err) => console.log(err))
    }

    this.Modal.hide()
  }

}
