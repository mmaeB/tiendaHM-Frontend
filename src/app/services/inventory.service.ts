import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Inventory } from '../model/inventory';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private url: string = `${environment.HOST}/api/inventory`;

  private inventoryChange = new Subject<Inventory[]>();
  private messageChange = new Subject<string>();

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<Inventory[]>(this.url);
  }

  findById(id: number) {
    return this.http.get<Inventory>(`${this.url}/${id}`);
  }

  save(inventory: Inventory) {
    return this.http.post(this.url, inventory);
  }

  update(id: number, inventory: Inventory) {
    return this.http.put(`${this.url}/${id}`, inventory);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

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
