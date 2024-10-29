import { Injectable } from '@angular/core'
import { environment } from '../../../../environments/environment.development'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import {
  Habitacion,
  Resena,
  Reserva,
  ReservaStats,
  ReservaStatsAux,
  Usuario,
  Welcome,
} from '../../interfaces/response'
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

  async reserva(id_room: number): Promise<Reserva[]> {
    const { data, error } = await this.supabase
      .from('reserva')
      .select()
      .eq('id_habita', id_room)
      .returns<Reserva[]>()

    if (error) {
      return []
    }

    return data
  }

  async obtenerResena(id_resena: number): Promise<Resena[]> {
    const { data, error } = await this.supabase
      .from('resenas')
      .select()
      .eq('id_resena', id_resena)
      .returns<Resena[]>()

    if (error) {
      return []
    }

    return data
  }

  async obtenerReservas(): Promise<ReservaStatsAux> {
    const { data, error } = await this.supabase
      .from('reserva')
      .select()
      .returns<Reserva[]>()

    const reservasValidas = data?.filter((reserva) => reserva.estado)

    const reservasPorHabitacion: { [key: number]: { [key: number]: number } } =
      {}

    reservasValidas!.forEach((reserva) => {
      if (!reservasPorHabitacion[reserva.id_habita]) {
        reservasPorHabitacion[reserva.id_habita] = {}
      }
      if (!reservasPorHabitacion[reserva.id_habita][reserva.id_usua]) {
        reservasPorHabitacion[reserva.id_habita][reserva.id_usua] = 0
      }
      reservasPorHabitacion[reserva.id_habita][reserva.id_usua]++
    })

    if (error) {
      return []
    }

    return reservasPorHabitacion
  }

  async usuario(idUser: number): Promise<Usuario[]> {
    const { data, error } = await this.supabase
      .from('usuario')
      .select()
      .eq('id_usua', idUser)
      .returns<Usuario[]>()

    if (error) {
      return []
    }

    return data
  }

  async obtenerUsuarios(): Promise<Usuario[]> {
    const { data, error } = await this.supabase
      .from('usuario')
      .select()
      .returns<Usuario[]>()

    if (error) {
      return []
    }

    return data
  }

  generarFoto(): Observable<Welcome> {
    return this.http.get<Welcome>('https://randomuser.me/api/')
  }

  async resena(id_user: number): Promise<Resena[]> {
    const { data, error } = await this.supabase
      .from('resenas')
      .select()
      .eq('id_usua', id_user)
      .returns<Resena[]>()

    if (error) {
      return []
    }

    return data
  }

  async validUser(user: number, password: string): Promise<boolean[]> {
    const { data, error } = await this.supabase
      .from('usuario')
      .select()
      .eq('id_usua', user)
      .returns<Usuario[]>()
    if (error) {
      return [false, false]
    }

    if (data[0].contra_usua === password && data[0].rol == 'admin') {
      return [true, true]
    }

    if (data[0].contra_usua === password) {
      return [true, false]
    }

    return [false, false]
  }
}
