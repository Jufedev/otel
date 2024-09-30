import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-card-room',
  standalone: true,
  imports: [],
  templateUrl: './card-room.component.html',
  styleUrl: './card-room.component.css',
})
export class CardRoomComponent {
  @Input() nombre: string = ''
  @Input() capacidad: number = 0
  @Input() imgs: string[] = []
}
