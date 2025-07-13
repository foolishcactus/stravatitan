import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MaindashboardComponent } from './maindashboard/maindashboard.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'maindashboard',
    component: MaindashboardComponent,
  },
];
