import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './main/game/game.component';
import { HomeComponent } from './main/home/home.component';
import { ProfileComponent } from './main/profile/profile.component';
import { WalletComponent } from './main/wallet/wallet.component';
import { LoginComponent } from './signin/login/login.component';
import { RegistrationComponent } from './signin/registration/registration.component';

const routes: Routes = [
  {path : '', component : LoginComponent},
  {path : 'register', component : RegistrationComponent},
  {path : 'main', component : HomeComponent},
  {path : 'game', component : GameComponent},
  {path : 'wallet', component : WalletComponent},
  {path : 'profile', component : ProfileComponent},
  {path : '**',redirectTo: '', component : LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
