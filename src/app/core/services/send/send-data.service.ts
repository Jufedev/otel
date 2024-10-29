import { Injectable } from '@angular/core'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment.development'
import { Resena, Reserva, Usuario } from '../../interfaces/response'
import { GetDataService } from '../get/get-data.service'

@Injectable({
  providedIn: 'root',
})
export class SendDataService {
  private supabase: SupabaseClient

  constructor(private getService: GetDataService) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    )
  }

  async createUser(user: Usuario): Promise<Usuario[]> {
    const { data, error } = await this.supabase
      .from('usuario')
      .insert(user)
      .select()

    if (error) {
      return []
    }

    return data
  }

  async createResena(resena: Resena):Promise<void>{
    const { error } = await this.supabase
      .from('resenas')
      .insert(resena)

    if (error) {
    }

  }

  async createReserva(
    reserva: Reserva,
    idUser: number,
    idRoom: number
  ): Promise<Reserva[]> {
    let isReserved = false

    await this.getService.reserva(idRoom).then((data) => {
      for (let index = 0; index < data.length; index++) {
        const ele = data[index]
        if (
          (new Date(ele.fec_inicio).getTime() <
            new Date(reserva.fec_inicio).getTime() &&
            ele.estado) ||
          (new Date(reserva.fec_inicio).getTime() <
            new Date(ele.fec_final).getTime() &&
            ele.estado)
        ) {
          isReserved = true
          break
        }
      }
    })

    if (isReserved) {
      console.log('Fecha invalida')
      return []
    }

    await this.getService.usuario(idUser).then(async (data) => {
      await this.supabase
        .from('usuario')
        .update({ reservas_usua: data[0].reservas_usua + 1 })
        .eq('id_usua', idUser)
    })

    const { data, error } = await this.supabase
      .from('reserva')
      .insert(reserva)
      .select()

    if (error) {
      return []
    }

    return data!
  }

  async updateReserva(idReserva: number): Promise<void> {
    const { error } = await this.supabase
      .from('reserva')
      .update({ estado: false })
      .eq('id_reserva', idReserva)

    if (error) {
    }
  }
}
