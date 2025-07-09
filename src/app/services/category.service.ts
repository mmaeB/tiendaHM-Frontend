import { inject, Injectable } from '@angular/core';
import { Category } from '../model/category';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends GenericService<Category>{
  private categoryChange: Subject<Category[]> = new Subject<Category[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor() {
    super(
      inject(HttpClient),
      `${environment.HOST}/categories`
    );
  }

  ///////////////////////////////////
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
