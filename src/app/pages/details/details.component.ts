import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Habitacion } from 'src/app/core/interfaces/response'
import { GetDataService } from 'src/app/core/services/get/get-data.service'
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component'

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NavBarComponent],
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

  constructor(
    private supabaseService: GetDataService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.roomId = params.get('roomid')!
    })

    await this.supabaseService
      .habitacion(this.roomId)
      .then((data) => (this.roomData = data[0]))

    await this.supabaseService.reserva(this.roomId)
  }
}
