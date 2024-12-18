import { Component } from '@angular/core'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { Habitacion, Reserva } from 'src/app/core/interfaces/response'
import { GetDataService } from 'src/app/core/services/get/get-data.service'
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component'
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { SendDataService } from 'src/app/core/services/send/send-data.service'
import { FooterComponent } from '../../components/footer/footer.component'

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NavBarComponent, ReactiveFormsModule, RouterLink, FooterComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  public roomData: Habitacion = {
    id_habita: 0,
    id_sede: 0,
    img_habita: [''],
    desc_habita: '',
    cant_usua: 0,
    nom_habita: '',
    serv_habita: [''],
    logo_serv: [''],
    precio: 0,
  }
  private roomId = ''
  public idUser!: string | null
  public userPhoto = ''
  public isLogged = false
  public reservasRoom!: Reserva[]
  public reservado = false
  private lastReserva!: Reserva | undefined

  public total_c = 0
  public total_c_calidad_precio = 0
  public total_c_limpieza = 0
  public total_c_ubicacion = 0
  public total_c_wifi = 0

  constructor(
    private supabaseGetService: GetDataService,
    private supabaseSendService: SendDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public reservaForm = new FormGroup(
    {
      fec_inicio: new FormControl('', Validators.required),
      fec_final: new FormControl('', Validators.required),
    },
    { validators: this.dateValidator('fec_inicio', 'fec_final') }
  )

  async ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.roomId = params.get('roomid')!
    })

    await this.supabaseGetService
      .habitacion(this.roomId)
      .then((data) => (this.roomData = data[0]))

    this.idUser = sessionStorage.getItem('user')

    if (this.idUser) {
      const user = await this.supabaseGetService.usuario(Number(this.idUser))
      this.userPhoto = user[0].imagen_usua
      this.isLogged = true
    }

    this.supabaseGetService.reserva(Number(this.roomId)).then((data) => {
      this.reservasRoom = data

      this.lastReserva = this.reservasRoom
        ?.slice()
        .reverse()
        .find((item) => item.id_usua === Number(this.idUser))

      if (this.lastReserva?.estado) {
        this.reservado = true
      }
    })

    const resenas = await this.supabaseGetService.resenaRate(
      Number(this.roomId)
    )

    resenas.forEach((ele) => {
      this.total_c_calidad_precio += ele.c_calidad_precio
      this.total_c_limpieza += ele.c_limpieza
      this.total_c_ubicacion += ele.c_ubicacion
      this.total_c_wifi += ele.c_wifi
    })

    this.total_c_calidad_precio = this.total_c_calidad_precio / resenas.length
    this.total_c_limpieza = this.total_c_limpieza / resenas.length
    this.total_c_ubicacion = this.total_c_ubicacion / resenas.length
    this.total_c_wifi = this.total_c_wifi / resenas.length

    this.total_c =
      (this.total_c_calidad_precio +
        this.total_c_limpieza +
        this.total_c_ubicacion +
        this.total_c_wifi) /
      4
  }

  dateValidator(fec_inicio: string, fec_final: string): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(fec_inicio)
      const dateControl = abstractControl.get(fec_final)

      if (dateControl!.errors && !dateControl!.errors?.['confirmedValidator']) {
        return null
      }

      if (
        new Date(control!.value).getTime() >
          new Date(dateControl!.value).getTime() ||
        new Date(control!.value).getTime() < new Date().getTime()
      ) {
        const error = { confirmedValidator: 'Date not must be in past.' }
        dateControl!.setErrors(error)
        return error
      } else {
        dateControl!.setErrors(null)
        return null
      }
    }
  }

  onSubmit() {
    const reserva: Reserva = {
      id_habita: Number(this.roomId),
      id_usua: Number(sessionStorage.getItem('user')),
      fec_inicio: this.reservaForm.value.fec_inicio!,
      fec_final: this.reservaForm.value.fec_final!,
      estado: true,
    }

    const dataReserva = this.supabaseSendService.createReserva(
      reserva,
      Number(sessionStorage.getItem('user')),
      Number(this.roomId)
    )
    dataReserva.then((data) => {
      /* let auxvaaar = sessionStorage.getItem('reserva')
      

      console.log(auxvaaar);
      
      if (auxvaaar) {
        sessionStorage.removeItem('reserva')
      } */
      sessionStorage.setItem('reserva', `${data[0].id_reserva}`)
      window.location.reload()
    })

    this.reservaForm.reset()
  }

  async onCancel() {
    await this.supabaseSendService.updateReserva(
      Number(this.lastReserva?.id_reserva)
    )
    window.location.reload()
  }

  onRate() {
    this.router.navigate([`room/${this.roomId}/rate`])
  }
}
