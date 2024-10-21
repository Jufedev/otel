import { Component, OnInit } from '@angular/core'
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component'
import { GetDataService } from 'src/app/core/services/get/get-data.service'
import { Router } from '@angular/router'
import {
  Reserva,
  ReservaStats,
  ReservaStatsAux,
  Usuario,
} from 'src/app/core/interfaces/response'

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

  public users!: Usuario[]
  public rooms!: ReservaStats[]

  public usersV: boolean = false
  public roomsV: boolean = false

  constructor(
    private supabaseService: GetDataService,
    private router: Router
  ) {}

  async ngOnInit() {
    const idUser = sessionStorage.getItem('user')
    if (idUser) {
      const usuario = await this.supabaseService.usuario(Number(idUser))
      this.userPhoto = usuario[0].imagen_usua
      this.isLogged = true
    }

    if (!this.isLogged) {
      this.router.navigate(['/'])
    }

    this.users = await this.supabaseService.obtenerUsuarios()

    const reservasData = await this.supabaseService.obtenerReservas()
    this.rooms = await Promise.all(
      Object.entries(reservasData).map(async ([habitacion, reservas]) => {
        const habitacionData = await this.supabaseService.habitacion(habitacion)

        const reservasArray = await Promise.all(
          Object.entries(reservas).map(async ([idUsuario, cantidad]) => {
            const usuarioData = await this.supabaseService.usuario(
              Number(idUsuario)
            )
            return {
              nombreUsuario: usuarioData[0].nom_usua,
              cantidad,
            }
          })
        )

        return {
          habitacion: habitacionData[0].nom_habita,
          reservas: reservasArray,
        }
      })
    )
  }

  onUsers() {
    this.usersV = true
    this.roomsV = false
  }

  onRooms() {
    this.roomsV = true
    this.usersV = false
  }
}
