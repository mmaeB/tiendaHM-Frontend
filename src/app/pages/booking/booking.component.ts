import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { BookingDialogComponent } from './booking-dialog/booking-dialog.component';
import { RouterOutlet } from '@angular/router';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Booking } from '../../model/booking';
import { BookingService } from '../../services/booking.service';
@Component({
  selector: 'app-booking',
   imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInput,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    RouterOutlet,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {
 dataSource: MatTableDataSource<Booking>;

columnsDefinitions = [
  { def: 'idBooking', label: 'ID', hide: true },
  { def: 'client', label: 'Cliente', hide: false },
  { def: 'product', label: 'Producto', hide: false },
  { def: 'cantidad', label: 'Cantidad', hide: false },
  { def: 'fechaReserva', label: 'Fecha', hide: false },
  { def: 'estado', label: 'Estado', hide: false },
  { def: 'actions', label: 'Acciones', hide: false }
];



  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private bookingService: BookingService, // inyecta el servicio
    private _dialog: MatDialog, // para abrir el modal
    private _snackBar: MatSnackBar // Notificaciones
  ) { }

  ngOnInit(): void {
    this.bookingService.findAll().subscribe(data => {
      this.createTable(data);
    });
    

    this.bookingService.getBookingChange().subscribe(data => this.createTable(data));

    this.bookingService.getMessageChange().subscribe(
      data =>
        this._snackBar.open(data, 'INFO',
          { duration: 2000, horizontalPosition: 'right', verticalPosition: 'bottom' }
        )
    );
  }

  // Método de creación de la tabla
  createTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Método para habilitar la búsqueda en la tabla
  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();
  }

  // Método para mostrar solo las columnas que no tienen el atributo hide=true
  getDisplayedColumns(): string[] {
    return this.columnsDefinitions.filter(c => !c.hide).map(c => c.def);
  }
    // Metodo para elimar
  delete(id: number) {
    this.bookingService.delete(id)
      .pipe(switchMap(() => this.bookingService.findAll()))
      .subscribe(data => {
        this.bookingService.setBookingChange(data);
        this.bookingService.setMessageChange('Book DELETED!')
      })
  }

  // Metodo para abrir el modal
openDialog(booking?: Booking) {
  setTimeout(() => {
    this._dialog.open(BookingDialogComponent, {
      width: '750px',
      data: booking,
      autoFocus: true
    });
  });
}

}
