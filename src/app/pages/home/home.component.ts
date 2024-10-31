import { Component, OnInit } from '@angular/core'
import { GetDataService } from '../../core/services/get/get-data.service'
import { Habitacion } from '../../core/interfaces/response'
import { CardRoomComponent } from '../../components/card-room/card-room.component'
import { RouterLink } from '@angular/router'
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component'
import { FooterComponent } from 'src/app/components/footer/footer.component'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardRoomComponent, RouterLink, NavBarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  public roomData: Habitacion[] = []
  public userPhoto = ''
  public isLogged = false

  constructor(private supabaseService: GetDataService) {}

  async ngOnInit() {
    await this.supabaseService.habitaciones().then((data) => {
      this.roomData = data
    })

    await this.supabaseService.habitaciones().then((data) => {
      this.roomData = data
    })

    const idUser = sessionStorage.getItem('user')
    if (idUser) {
      const user = await this.supabaseService.usuario(Number(idUser))
      this.userPhoto = user[0].imagen_usua
      this.isLogged = true
    }
  }
}
