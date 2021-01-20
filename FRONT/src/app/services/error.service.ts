import { Injectable, Input } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Alert } from '../models/Alert.model';

@Injectable({
    providedIn: 'root'
  })
export class ErrorService {

    private msg$ = new BehaviorSubject<string>('');
    cast = this.msg$.asObservable();

    private Alert$ = new Subject<Alert>();
    alertCast = this.Alert$.asObservable();

constructor() {}

    setMsg(msg: string) {
        this.msg$.next(msg)
    }

    setAlert(alert: Alert) {
        this.Alert$.next(alert)
    }

}