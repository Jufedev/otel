import { Injectable } from '@angular/core'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment.development'
import { Reserva, Usuario } from '../../interfaces/response'

@Injectable({
  providedIn: 'root',
})
export class SendDataService {
  private supabase: SupabaseClient

  constructor() {
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

  async createReserva(reserva: Reserva): Promise<Reserva[]> {
    const { data, error } = await this.supabase
      .from('reserva')
      .insert(reserva)
      .select()

    if (error) {
      return []
    }

    return data!
  }
}
