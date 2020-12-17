import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ActualityComponent } from './actuality/actuality.component'
import { AuthGuard } from './services/auth-guard.service';

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  //{path: 'accueil', component: ActualityComponent, canActivate: [AuthGuard]},
  {path: 'accueil', component: ActualityComponent},
  {path: '', pathMatch: 'full', redirectTo: 'accueil'},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
