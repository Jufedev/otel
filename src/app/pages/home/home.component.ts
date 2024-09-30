import { Component, OnInit } from '@angular/core'
import { GetDataService } from '../../core/services/get/get-data.service'
import { Habitacion } from '../../core/interfaces/response'
import { CardRoomComponent } from '../../components/card-room/card-room.component'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardRoomComponent, RouterLink],
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
  }
}
