import { Component, input, Input } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-card-room',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './card-room.component.html',
  styleUrl: './card-room.component.css',
})
export class CardRoomComponent {
  @Input() nombre: string = ''
  @Input() capacidad: number = 0
  @Input() image: string[] = []
  @Input() id_habita: number = 0
}
