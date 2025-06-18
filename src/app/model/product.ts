import { Category } from './category';

export interface Product {
  idProduct: number;
  descripcion: string;
  equipo: string;
  genero: string;
  marca: string;
  nombre: string;
  precio: number;
  stock: number;
  talla: string;
  category?: Category;
}
