import { Component, Input, OnInit } from '@angular/core'
import { NgOptimizedImage } from '@angular/common'
import { Router, RouterLink } from '@angular/router'

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit {
  @Input() userImg!: string
  @Input() logged!: boolean

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.userImg.length == 0) {
      this.userImg =
        'https://www.asofiduciarias.org.co/wp-content/uploads/2018/06/sin-foto.png'
    }
  }

  closeSesion(): void {
    sessionStorage.clear()

    if (this.router.url === '/admin') {
      this.router.navigate(['/'])
    } else {
      window.location.reload()
    }
  }
}
