import { Component, OnInit } from '@angular/core'
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { Observable } from 'rxjs'
import { Usuario, Welcome } from 'src/app/core/interfaces/response'
import { GetDataService } from 'src/app/core/services/get/get-data.service'
import { SendDataService } from 'src/app/core/services/send/send-data.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  public isActive = true
  public photoResults$!: Observable<Welcome>
  public photoUser!: string

  constructor(
    private supabaseService: SendDataService,
    private getService: GetDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.photoResults$ = this.getService.generarFoto()
    this.photoResults$.subscribe((data) => {
      data.results.forEach((element) => {
        this.photoUser = element.picture.medium
      })
    })
  }

  public singUpForm = new FormGroup(
    {
      id_usua: new FormControl('', Validators.required),
      nom_usua: new FormControl('', Validators.required),
      correo_usua: new FormControl('', [Validators.required, Validators.email]),
      tel_usua: new FormControl('', Validators.required),
      contra_usua: new FormControl('', Validators.required),
      confirm_contra: new FormControl('', Validators.required),
    },
    { validators: this.matchValidator('contra_usua', 'confirm_contra') }
  )

  public logInForm = new FormGroup({
    id_usua: new FormControl('', Validators.required),
    contra_usua: new FormControl('', Validators.required),
  })

  toggle() {
    this.isActive = !this.isActive
  }

  /* https://stackoverflow.com/questions/71765341/confirm-password-validation-in-angular#:~:text=I%20had%20to%20create%20a%20validation%20where%20%22New%20Password */
  matchValidator(
    controlPass: string,
    matchingControlPass: string
  ): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(controlPass)
      const matchingControl = abstractControl.get(matchingControlPass)

      if (
        matchingControl!.errors &&
        !matchingControl!.errors?.['confirmedValidator']
      ) {
        return null
      }

      if (control!.value !== matchingControl!.value) {
        const error = { confirmedValidator: 'Passwords do not match.' }
        matchingControl!.setErrors(error)
        return error
      } else {
        matchingControl!.setErrors(null)
        return null
      }
    }
  }

  onSubmit(): void {
    const user: Usuario = {
      id_usua: Number(this.singUpForm.value.id_usua),
      nom_usua: this.singUpForm.value.nom_usua!,
      correo_usua: this.singUpForm.value.correo_usua!,
      tel_usua: Number(this.singUpForm.value.tel_usua!),
      contra_usua: this.singUpForm.value.contra_usua!,
      reservas_usua: 0,
      fec_registro: new Date().toISOString(),
      rol: 'usuario',
      imagen_usua: this.photoUser,
    }

    this.supabaseService.createUser(user)

    this.singUpForm.reset()
  }

  onLogin(): void {
    const user = this.logInForm.value.id_usua
    const password = this.logInForm.value.contra_usua

    this.getService.validUser(Number(user), password!).then((data) => {
      sessionStorage.setItem('user', user!)
      sessionStorage.setItem('password', password!)

      if (data[1]) {
        this.logInForm.reset()
        this.router.navigate(['/admin'])
      } else if (data[0]) {
        this.logInForm.reset()
        this.router.navigate(['/'])
      }
    })
  }
}
