import { inject, Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Booking } from '../model/booking';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BookingService extends GenericService<Booking> {
  private bookingChange: Subject<Booking[]> = new Subject<Booking[]>;
    private messageChange: Subject<string> = new Subject<string>;
    constructor() {
      super(
        inject(HttpClient),
        `${environment.HOST}/bookings`
      );
    }
      listPageable(p: number, s: number){
    return this.http.get<any>(`${environment.HOST}/bookings/pageable?page=${p}&size=${s}`);
  }
    

    ///////////////////////////////////
    setBookingChange(data: Booking[]) {
      this.bookingChange.next(data);
    }
  
    getBookingChange() {
      return this.bookingChange.asObservable();
    }
  
    setMessageChange(data: string) {
      this.messageChange.next(data);
    }
  
    getMessageChange() {
      return this.messageChange.asObservable();
    }
}
