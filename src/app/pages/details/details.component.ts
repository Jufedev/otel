import { Component } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
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

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NavBarComponent, ReactiveFormsModule, RouterLink],
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
    precio: 0,
  }
  private roomId = ''
  private idUser!: string | null
  public userPhoto = ''
  public isLogged = false
  public reservasRoom!: Reserva[]
  public reservado = false
  private lastReserva!: Reserva | undefined

  constructor(
    private supabaseGetService: GetDataService,
    private supabaseSendService: SendDataService,
    private route: ActivatedRoute
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
  }

  dateValidator(fec_inicio: string, fec_final: string): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(fec_inicio)
      const dateControl = abstractControl.get(fec_final)

      if (dateControl!.errors && !dateControl!.errors?.['confirmedValidator']) {
        return null
      }

      if (sessionStorage.getItem('user') === null) {
        const error = { confirmedValidator: 'User must be have logged.' }
        dateControl!.setErrors(error)
        return error
      }

      if (
        new Date(control!.value).getTime() >
        new Date(dateControl!.value).getTime()
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

    if (sessionStorage.getItem('user') === null) {
      // ToDo: Hacer un dialogo que le diga al usuario que se logee
      console.log('Usuario no registrado')
    } else {
      const dataReserva = this.supabaseSendService.createReserva(reserva)
      dataReserva.then((data) => {
        sessionStorage.setItem('reserva', `${data[0].id_reserva}`)
        window.location.reload()
      })
    }

    this.reservaForm.reset()
  }

  async onCancel() {
    await this.supabaseSendService.updateReserva(
      Number(this.lastReserva?.id_reserva)
    )
    window.location.reload()
  }
}
