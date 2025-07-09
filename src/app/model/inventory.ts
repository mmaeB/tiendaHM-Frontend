import { Producto } from './producto';

export interface Inventory {
  idInventory: number;
  producto: Producto; 
  stockActual: number;
  stockMinimo: number;
  ultimaActualizacion: string; // ISO string
}
