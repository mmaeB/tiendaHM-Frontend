import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { SaleDialogComponent } from './sale-dialog/sale-dialog.component';
import { RouterOutlet } from '@angular/router';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Sale } from '../../model/sale';
import { SaleService } from '../../services/sale.service';
@Component({
  selector: 'app-sale',
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
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent {
 dataSource: MatTableDataSource<Sale>;

columnsDefinitions = [
  { def: 'idSale', label: 'ID', hide: true },
  { def: 'client', label: 'Cliente', hide: false },
  { def: 'product', label: 'Producto', hide: false },
  { def: 'cantidad', label: 'Cantidad', hide: false },
  { def: 'fechaVenta', label: 'Fecha Venta', hide: false },
  { def: 'actions', label: 'Acciones', hide: false }
];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private saleService: SaleService, // inyecta el servicio
    private _dialog: MatDialog, // para abrir el modal
    private _snackBar: MatSnackBar // Notificaciones
  ) { }

  ngOnInit(): void {
    this.saleService.findAll().subscribe(data => {
      this.createTable(data);
    });
    

    this.saleService.getSaleChange().subscribe(data => this.createTable(data));

    this.saleService.getMessageChange().subscribe(
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
    this.saleService.delete(id)
      .pipe(switchMap(() => this.saleService.findAll()))
      .subscribe(data => {
        this.saleService.setSaleChange(data);
        this.saleService.setMessageChange('Book DELETED!')
      })
  }

  // Metodo para abrir el modal
openDialog(sale?: Sale) {
  setTimeout(() => {
    this._dialog.open(SaleDialogComponent, {
      width: '750px',
      data: sale,
      autoFocus: true
    });
  });
}

}
