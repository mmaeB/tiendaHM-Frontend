import { Client } from './client';
import { Producto } from './producto';

export interface Sale {
  idSale: number;
  client: Client;
  product: Producto;
  cantidad: number;
  fechaVenta: string; // ISO string
}
