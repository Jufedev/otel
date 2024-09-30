import { Component, OnInit } from '@angular/core'
import { GetDataService } from '../../core/services/get/get-data.service'
import { Habitacion } from '../../core/interfaces/response'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  public roomData: Habitacion[] = []

  constructor(private supabaseService: GetDataService) {}

  async ngOnInit() {
    await this.supabaseService
      .habitaciones()
      .then((data) => (this.roomData = data))

    console.log(this.roomData)
  }
}
