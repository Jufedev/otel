import { Component, inject, OnInit } from '@angular/core'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { NavBarComponent } from 'src/app/components/nav-bar/nav-bar.component'
import { Resena } from 'src/app/core/interfaces/response'
import { GetDataService } from 'src/app/core/services/get/get-data.service'
import { SendDataService } from 'src/app/core/services/send/send-data.service'

@Component({
  selector: 'app-rate-form',
  standalone: true,
  imports: [RouterLink, NavBarComponent, ReactiveFormsModule],
  templateUrl: './rate-form.component.html',
  styleUrl: './rate-form.component.css',
})
export class RateFormComponent implements OnInit {
  public userPhoto = ''
  public isLogged = false
  private roomId = ''
  private idUser = ''
  public resenasUser: Resena[] = []
  public isReserved = false
  public resena: Resena[] = []

  public options = ['1', '2', '3', '4', '5']

  constructor(
    private supabaseService: GetDataService,
    private sendData: SendDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.idUser = sessionStorage.getItem('user')!
    if (this.idUser) {
      const user = await this.supabaseService.usuario(Number(this.idUser))
      this.userPhoto = user[0].imagen_usua
      this.isLogged = true
    }

    this.route.paramMap.subscribe((params) => {
      this.roomId = params.get('roomid')!
    })

    this.resenasUser = await this.supabaseService.resena(Number(this.idUser))

    this.resenasUser.forEach(async (ele) => {
      if (ele.id_habita == Number(this.roomId)) {
        this.isReserved = true
        this.resena = await this.supabaseService.obtenerResena(ele.id_resena!)
      }
    })
  }

  public rtFo = inject(FormBuilder)

  public rateForm: FormGroup = this.rtFo.group({
    c_limpieza: ['', Validators.required],
    c_ubicacion: ['', Validators.required],
    c_wifi: ['', Validators.required],
    c_calidad_precio: ['', Validators.required],
  })

  onSubmit() {
    const resena: Resena = {
      id_habita: Number(this.roomId),
      id_usua: Number(sessionStorage.getItem('user')),
      c_limpieza: Number(this.rateForm.value.c_limpieza),
      c_ubicacion: Number(this.rateForm.value.c_ubicacion),
      c_wifi: Number(this.rateForm.value.c_wifi),
      c_calidad_precio: Number(this.rateForm.value.c_calidad_precio),
    }

    this.sendData.createResena(resena)

    this.rateForm.reset()

    this.router.navigate(['/'])
  }
}
