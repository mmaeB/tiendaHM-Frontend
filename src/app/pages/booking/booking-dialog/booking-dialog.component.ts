import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Booking } from '../../../model/booking';
import { BookingService } from '../../../services/booking.service';
import { ClientService } from '../../../services/client.service';
import { ProductoService } from '../../../services/product.service';
import { Client } from '../../../model/client';
import { Producto } from '../../../model/producto';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-booking-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatToolbarModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './booking-dialog.component.html',
  styleUrl: './booking-dialog.component.css'
})
export class BookingDialogComponent {
  booking: Booking;
  clients: Client[] = [];
  productos: Producto[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Booking,
    private _dialogRef: MatDialogRef<BookingDialogComponent>,
    private bookingService: BookingService,
    private clientService: ClientService,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.booking = { ...this.data };

    // Cargar combos
    this.clientService.findAll().subscribe(data => this.clients = data);
    this.productoService.findAll().subscribe(data => this.productos = data);
  }

  close() {
    this._dialogRef.close();
  }
compareClient = (c1: Client, c2: Client): boolean => {
  return c1 && c2 ? c1.idClient === c2.idClient : c1 === c2;
};

compareProduct = (p1: Producto, p2: Producto): boolean => {
  return p1 && p2 ? p1.idProduct === p2.idProduct : p1 === p2;
};

  operate() {
  if (!this.booking.client?.idClient || !this.booking.product?.idProduct) {
    alert('Seleccione cliente y producto válidos');
    return;
  }

  this.bookingService.save(this.booking)
    .pipe(switchMap(() => this.bookingService.findAll()))
    .subscribe(data => {
      this.bookingService.setBookingChange(data);
      this.bookingService.setMessageChange('CREATED!');
    });

  this.close();
}
}
