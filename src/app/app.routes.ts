import { Routes } from '@angular/router'
import { HomeComponent } from './pages/home/home.component'
import { DetailsComponent } from './pages/details/details.component'
import { LoginComponent } from './pages/login/login.component'

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'room/:roomid',
    component: DetailsComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
]
