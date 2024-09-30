import { Injectable } from '@angular/core'
import { environment } from '../../../../environments/environment.development'
import {
  AuthSession,
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js'
import { Habitacion } from '../../interfaces/response'

@Injectable({
  providedIn: 'root',
})
export class GetDataService {
  private supabase: SupabaseClient
  private session!: AuthSession

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    )
  }

  async habitaciones(): Promise<Habitacion[]> {
    const { data, error } = await this.supabase
      .from('habitacion')
      .select()
      .returns<Habitacion[]>()
    if (error) {
      return []
    }
    return data
  }

  async habitacion(id_room: string): Promise<Habitacion[]> {
    const { data, error } = await this.supabase
      .from('habitacion')
      .select()
      .eq('id_habita', id_room)
      .returns<Habitacion[]>()
    if (error) {
      return []
    }

    return data
  }
}
