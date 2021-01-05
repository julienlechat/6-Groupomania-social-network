import { Component, OnInit } from '@angular/core';
import { ActualityService } from '../services/actuality.service';
import { Subscription } from 'rxjs';
import { Actuality } from '../models/Actuality.model';

@Component({
  selector: 'app-actuality',
  templateUrl: './actuality.component.html',
  styleUrls: ['./actuality.component.css']
})

export class ActualityComponent implements OnInit {
  
  actualitySub?: Subscription;
  actus: Actuality[] = [];

  constructor(private Actuality: ActualityService) { }


  ngOnInit(): void {
    this.actualitySub = this.Actuality.Actuality$.subscribe(
      (actus) => {
        this.actus = actus;
      },
      (error) => {
        console.log(error);
      }
    );
    this.Actuality.getActuality();
  }


}
