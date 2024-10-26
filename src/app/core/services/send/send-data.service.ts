import { Injectable } from '@angular/core'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment.development'
import { Reserva, Usuario } from '../../interfaces/response'
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

  async createReserva(reserva: Reserva, idUser: number): Promise<Reserva[]> {
    const { data, error } = await this.supabase
      .from('reserva')
      .insert(reserva)
      .select()

    await this.getService.usuario(idUser).then(async (data) => {
      await this.supabase
        .from('usuario')
        .update({ reservas_usua: data[0].reservas_usua + 1 })
    })

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
