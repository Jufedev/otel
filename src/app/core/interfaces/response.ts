export interface Response {}

export interface Habitacion {
  id_habita: number
  id_sede: number
  img_habita: string[]
  desc_habita: string
  cant_usua: number
  nom_habita: string
  serv_habita: string[]
  precio: number
}

export interface Reserva {
  id_reserva?: number
  id_habita: number
  id_usua: number
  fec_inicio: string
  fec_final: string
  estado: boolean
}

export interface Usuario {
  id_usua: number
  nom_usua: string
  correo_usua: string
  tel_usua: number
  contra_usua: string
  reservas_usua: number
  fec_registro: string
  rol: string
  imagen_usua: string
}

export interface Welcome {
  results: Result[]
  info: Info
}

export interface Info {
  seed: string
  results: number
  page: number
  version: string
}

export interface Result {
  gender: string
  name: Name
  location: Location
  email: string
  login: Login
  dob: Dob
  registered: Dob
  phone: string
  cell: string
  id: ID
  picture: Picture
  nat: string
}

export interface Dob {
  date: Date
  age: number
}

export interface ID {
  name: string
  value: string
}

export interface Location {
  street: Street
  city: string
  state: string
  country: string
  postcode: number
  coordinates: Coordinates
  timezone: Timezone
}

export interface Coordinates {
  latitude: string
  longitude: string
}

export interface Street {
  number: number
  name: string
}

export interface Timezone {
  offset: string
  description: string
}

export interface Login {
  uuid: string
  username: string
  password: string
  salt: string
  md5: string
  sha1: string
  sha256: string
}

export interface Name {
  title: string
  first: string
  last: string
}

export interface Picture {
  large: string
  medium: string
  thumbnail: string
}
