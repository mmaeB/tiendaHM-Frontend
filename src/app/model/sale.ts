import { Client } from './client';
import { Product } from './product';

export interface Sale {
  id_sale: number;
  cantidad: number;
  fecha_venta: string;
  client?: Client;
  product?: Product;
}