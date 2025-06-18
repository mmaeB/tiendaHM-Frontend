import { Component, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { Inventory } from '../../model/inventory';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ]
})
export class InventoryComponent implements OnInit {
  dataSource: MatTableDataSource<Inventory>;

columnsDefinitions = [
  { def: 'nombreProducto', label: 'Nombre Producto', hide: false },
  { def: 'stockActual', label: 'Stock Actual', hide: false },
  { def: 'stockMinimo', label: 'Stock Mínimo', hide: false },
  { def: 'ultimaActualizacion', label: 'Última Actualización', hide: false },
  { def: 'idProduct', label: 'ID Producto', hide: true } 
];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private inventoryService: InventoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.inventoryService.findAll().subscribe((data) => {
      this.createTable(data);
    });

    this.inventoryService.getMessageChange().subscribe((data) => {
      this.snackBar.open(data, 'INFO', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
    });
  }

  createTable(data: Inventory[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions
      .filter((cd) => !cd.hide)
      .map((cd) => cd.def);
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(id: number) {
    this.inventoryService
      .delete(id)
      .pipe(switchMap(() => this.inventoryService.findAll()))
      .subscribe((data) => {
        this.inventoryService.setInventoryChange(data);
        this.inventoryService.setMessageChange('Inventario eliminado');
      });
  }
}
