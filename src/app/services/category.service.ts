import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Category } from '../model/category';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private url: string = `${environment.HOST}/api/categories`;

  private categoryChange = new Subject<Category[]>();
  private messageChange = new Subject<string>();

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<Category[]>(this.url);
  }

  findById(id: number) {
    return this.http.get<Category>(`${this.url}/${id}`);
  }

  save(product: Category) {
    return this.http.post(this.url, product);
  }

  update(id: number, product: Category) {
    return this.http.put(`${this.url}/${id}`, product);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  setCategoryChange(data: Category[]) {
    this.categoryChange.next(data);
  }

  getCategoryChange() {
    return this.categoryChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
}
