import { inject, Injectable } from '@angular/core';
import { Inventory } from '../model/inventory';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class InventoryService extends GenericService<Inventory>{
  private inventoryChange: Subject<Inventory[]> = new Subject<Inventory[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor() {
    super(
      inject(HttpClient),
      `${environment.HOST}/inventories`
    );
  }

  ///////////////////////////////////
  setInventoryChange(data: Inventory[]) {
    this.inventoryChange.next(data);
  }

  getInventoryChange() {
    return this.inventoryChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
}
