import { Component, OnInit } from '@angular/core'
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component'
import { GetDataService } from 'src/app/core/services/get/get-data.service'
import { Router, RouterLink } from '@angular/router'
import {
  Reserva,
  ReservaStats,
  ReservaStatsAux,
  Usuario,
} from 'src/app/core/interfaces/response'

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NavBarComponent, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  public userPhoto = ''
  public isLogged = false
  public isAdmin = false

  public users!: Usuario[]
  public rooms!: ReservaStats[]

  public usersV: boolean = false
  public roomsV: boolean = false

  public rolUser!: string

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
      this.rolUser = usuario[0].rol
    }

    console.log(this.rolUser)

    if (!this.isLogged) {
      this.router.navigate(['/'])
    }

    if (this.rolUser != 'admin') {
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

  sortUsers(option: number, ascdes: number) {
    const sortBy = <K extends keyof Usuario>(key: K) => {
      this.users.sort((a, b) => {
        if (typeof a[key] === 'number' && typeof b[key] === 'number') {
          return ascdes === 1 ? a[key] - b[key] : b[key] - a[key]
        }

        if (typeof a[key] === 'string' && typeof b[key] === 'string') {
          return ascdes === 1
            ? new Date(a[key]).getTime() - new Date(b[key]).getTime()
            : new Date(b[key]).getTime() - new Date(a[key]).getTime()
        }

        return 0
      })
    }

    switch (option) {
      case 1:
        sortBy('id_usua')
        break
      case 2:
        sortBy('reservas_usua')
        break
      case 3:
        sortBy('fec_registro')
        break
    }
  }
}
