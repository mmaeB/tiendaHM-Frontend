import { inject, Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Sale } from '../model/sale';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SaleService extends GenericService<Sale> {
  private saleChange: Subject<Sale[]> = new Subject<Sale[]>;
    private messageChange: Subject<string> = new Subject<string>;
    constructor() {
      super(
        inject(HttpClient),
        `${environment.HOST}/sales`
      );
    }
      listPageable(p: number, s: number){
    return this.http.get<any>(`${environment.HOST}/sales/pageable?page=${p}&size=${s}`);
  }
    

    ///////////////////////////////////
    setSaleChange(data: Sale[]) {
      this.saleChange.next(data);
    }
  
    getSaleChange() {
      return this.saleChange.asObservable();
    }
  
    setMessageChange(data: string) {
      this.messageChange.next(data);
    }
  
    getMessageChange() {
      return this.messageChange.asObservable();
    }
}
