import { Category } from './category';

export interface Producto {
  idProduct: number;
  nombre: string;
  precio: number;
  descripcion: string;
  marca: string;
  talla: string;
  genero: string;
  equipo: string;
  stock: number;
  imagen: string;
  category: Category; 
}
