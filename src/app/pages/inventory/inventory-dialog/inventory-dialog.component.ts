import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { switchMap } from 'rxjs';
import { Inventory } from '../../../model/inventory';
import { InventoryService } from '../../../services/inventory.service';
import { ProductoService } from '../../../services/product.service';
import { Producto } from '../../../model/producto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-dialog',
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
  templateUrl: './inventory-dialog.component.html',
  styleUrl: './inventory-dialog.component.css'
})
export class InventoryDialogComponent {
  inventory: Inventory;
  productos: Producto[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Inventory,
    private _dialogRef: MatDialogRef<InventoryDialogComponent>,
    private inventoryService: InventoryService,
    private productService: ProductoService
  ) {}

ngOnInit(): void {
  this.inventory = { ...this.data };

  // Si es nuevo (sin ID), establecer fecha actual
  if (!this.inventory.idInventory) {
    const now = new Date();
    const isoString = now.toISOString().substring(0, 16); // formato: yyyy-MM-ddTHH:mm
    this.inventory.ultimaActualizacion = isoString;
  }

  this.productService.findAll().subscribe(data => {
    this.productos = data;
  });
}
  close(): void {
    this._dialogRef.close();
  }

  
  compareProduct = (p1: Producto, p2: Producto): boolean => {
    return p1 && p2 ? p1.idProduct === p2.idProduct : p1 === p2;
  };
  

  operate(): void {
    if (this.inventory && this.inventory.idInventory > 0) {
      this.inventoryService.update(this.inventory.idInventory, this.inventory)
        .pipe(switchMap(() => this.inventoryService.findAll()))
        .subscribe(data => {
          this.inventoryService.setInventoryChange(data);
          this.inventoryService.setMessageChange('¡Inventario actualizado!');
        });
    } else {
      this.inventoryService.save(this.inventory)
        .pipe(switchMap(() => this.inventoryService.findAll()))
        .subscribe(data => {
          this.inventoryService.setInventoryChange(data);
          this.inventoryService.setMessageChange('¡Inventario registrado!');
        });
    }

    this.close();
  }
}