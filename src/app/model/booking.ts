import { Client } from './client';
import { Producto } from './producto';

export interface Booking {
  idBooking: number;
  client: Client;

  product: Producto;
  cantidad: number;
  fechaReserva:Date; 
  estado: string;
}
