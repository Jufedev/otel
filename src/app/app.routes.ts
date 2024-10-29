import { Routes } from '@angular/router'
import { HomeComponent } from './pages/home/home.component'
import { DetailsComponent } from './pages/details/details.component'
import { LoginComponent } from './pages/login/login.component'
import { AdminComponent } from './pages/admin/admin.component'
import { RateFormComponent } from './pages/rate-form/rate-form.component'

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
    path: 'room/:roomid/rate',
    component: RateFormComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
  },
]
