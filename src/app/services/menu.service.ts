import { inject, Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Menu } from '../model/menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends GenericService<Menu> {
  
  private menuChange = new Subject<Menu[]>();

  constructor() {
    super(
      inject(HttpClient), 
      `${environment.HOST}/menus`
    );
  }

getMenusByUser() {
  return this.http.get<Menu[]>(`${environment.HOST}/menus/user`);
}


  getMenuChange() {
    return this.menuChange.asObservable();
  }

  setMenuChange(menus: Menu[]) {
    this.menuChange.next(menus);
  }
}
