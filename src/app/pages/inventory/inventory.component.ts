import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { switchMap } from 'rxjs';
import { Inventory } from '../../model/inventory';
import { InventoryService } from '../../services/inventory.service';
import { InventoryDialogComponent } from './inventory-dialog/inventory-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory',
  standalone: true,
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
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
    MatDialogModule,
    CommonModule
  ]
})
export class InventoryComponent {
  dataSource: MatTableDataSource<Inventory>;

  columnsDefinitions = [
    { def: 'idInventory', label: 'ID', hide: true },
    { def: 'producto', label: 'Producto', hide: false },
    { def: 'stockActual', label: 'Stock Actual', hide: false },
    { def: 'stockMinimo', label: 'Stock Mínimo', hide: false },
    { def: 'ultimaActualizacion', label: 'Última Actualización', hide: false },
    { def: 'actions', label: 'Acciones', hide: false }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private inventoryService: InventoryService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.inventoryService.findAll().subscribe(data => this.createTable(data));
    this.inventoryService.getInventoryChange().subscribe(data => this.createTable(data));
    this.inventoryService.getMessageChange().subscribe(msg =>
      this._snackBar.open(msg, 'INFO', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      })
    );
  }

  createTable(data: Inventory[]): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  getDisplayedColumns(): string[] {
    return this.columnsDefinitions.filter(c => !c.hide).map(c => c.def);
  }

  delete(id: number): void {
    this.inventoryService.delete(id)
      .pipe(switchMap(() => this.inventoryService.findAll()))
      .subscribe(data => {
        this.inventoryService.setInventoryChange(data);
        this.inventoryService.setMessageChange('¡Inventario eliminado!');
      });
  }

  openDialog(inventory?: Inventory): void {
    this._dialog.open(InventoryDialogComponent, {
      width: '600px',
      data: inventory,
      autoFocus: true
    });
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleString(); // <-- Solución reemplazo de | date:'short'
  }
}
