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
  public userPhoto = ''
  public isLogged = false
  public reservasRoom!: Promise<Reserva[]>

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

    await this.supabaseGetService.reserva(this.roomId)

    const idUser = sessionStorage.getItem('user')
    if (idUser) {
      const user = await this.supabaseGetService.usuario(Number(idUser))
      this.userPhoto = user[0].imagen_usua
      this.isLogged = true
    }

    this.reservasRoom = this.supabaseGetService.validReserva(
      Number(this.roomId)
    )
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

    this.reservasRoom.then((data) => {
      if (data.length !== 0) {
        let contador = 0
        for (let index = 0; index < data.length; index++) {
          const ele = data[index]

          if (
            new Date(ele.fec_inicio).getTime() <=
              new Date(reserva.fec_inicio).getTime() &&
            new Date(reserva.fec_inicio).getTime() <=
              new Date(ele.fec_final).getTime()
          ) {
            console.log('Fecha registrada')
            break
          }
          contador++
        }

        if (contador === data.length) {
          const dataReserva = this.supabaseSendService.createReserva(reserva)
          dataReserva.then((data) => {
            sessionStorage.setItem('reserva', `${data[0].id_reserva}`)
            window.location.reload()
          })
        }
      }
    })

    this.reservaForm.reset()
  }
}
