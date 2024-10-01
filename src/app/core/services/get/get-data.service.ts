import { Injectable } from '@angular/core'
import { environment } from '../../../../environments/environment.development'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Habitacion, Reserva, Welcome } from '../../interfaces/response'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class GetDataService {
  private supabase: SupabaseClient

  constructor(private http: HttpClient) {
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

  async reserva(id_room: string): Promise<Reserva[]> {
    const { data, error } = await this.supabase
      .from('reserva')
      .select()
      .eq('id_habita', id_room)
      .returns<Reserva[]>()
    if (error) {
      return []
    }

    console.log(data)

    return data
  }

  generarFoto(): Observable<Welcome> {
    return this.http.get<Welcome>('https://randomuser.me/api/')
  }
}
