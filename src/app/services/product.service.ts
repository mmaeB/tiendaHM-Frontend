import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Product } from '../model/product';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url: string = `${environment.HOST}/api/productos`;

  private productChange = new Subject<Product[]>();
  private messageChange = new Subject<string>();

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<Product[]>(this.url);
  }

  findById(id: number) {
    return this.http.get<Product>(`${this.url}/${id}`);
  }

  save(product: Product) {
    return this.http.post(this.url, product);
  }

  update(id: number, product: Product) {
    return this.http.put(`${this.url}/${id}`, product);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  setProductChange(data: Product[]) {
    this.productChange.next(data);
  }

  getProductChange() {
    return this.productChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
}
