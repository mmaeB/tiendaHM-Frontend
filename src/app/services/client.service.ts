import { inject, Injectable } from '@angular/core';
import { Client } from '../model/client';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends GenericService<Client>{
  private clientChange: Subject<Client[]> = new Subject<Client[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor() {
    super(
      inject(HttpClient),
      `${environment.HOST}/clients`
    );
  }

  ///////////////////////////////////
  setCategoryChange(data: Client[]) {
    this.clientChange.next(data);
  }

  getCategoryChange() {
    return this.clientChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
}
