import { Component, OnInit } from '@angular/core'
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component'
import { GetDataService } from 'src/app/core/services/get/get-data.service'

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NavBarComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  public userPhoto = ''
  public isLogged = false

  constructor(private supabaseService: GetDataService) {}

  async ngOnInit() {
    const idUser = sessionStorage.getItem('user')
    if (idUser) {
      const user = await this.supabaseService.usuario(Number(idUser))
      this.userPhoto = user[0].imagen_usua
      this.isLogged = true
    }
  }
}
