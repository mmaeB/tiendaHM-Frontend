import { Client } from './client';
import { Product } from './product';

export interface Booking {
  id_booking: number;
  cantidad: number;
  estado: string;
  fecha_reserva: string;
  client?: Client;
  product?: Product;
}