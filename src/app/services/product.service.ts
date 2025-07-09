import { inject, Injectable } from '@angular/core';
import { Producto } from '../model/producto';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends GenericService<Producto>{
  private productoChange: Subject<Producto[]> = new Subject<Producto[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor() {
    super(
      inject(HttpClient),
      `${environment.HOST}/productos`
    );
  }

  ///////////////////////////////////
  
  setProductChange(data: Producto[]) {
    this.productoChange.next(data);
  }

  getProductChange() {
    return this.productoChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }

saveWithImage(formData: FormData) {
  return this.http.post<Producto>(`${environment.HOST}/productos/with-image`, formData);
}

updateWithImage(id: number, formData: FormData) {
  return this.http.put<Producto>(`${environment.HOST}/productos/with-image/${id}`, formData);
}
}
