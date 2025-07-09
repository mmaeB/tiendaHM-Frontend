import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Sale } from '../../../model/sale';
import { SaleService } from '../../../services/sale.service';
import { ClientService } from '../../../services/client.service';
import { ProductoService } from '../../../services/product.service';
import { Client } from '../../../model/client';
import { Producto } from '../../../model/producto';
import { switchMap } from 'rxjs';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-sale-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatToolbarModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './sale-dialog.component.html',
  styleUrl: './sale-dialog.component.css'
})
export class SaleDialogComponent {
  sale: Sale;
  clients: Client[] = [];
  productos: Producto[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Sale,
    private _dialogRef: MatDialogRef<SaleDialogComponent>,
    private saleService: SaleService,
    private clientService: ClientService,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.sale = { ...this.data };

    // Cargar combos
    this.clientService.findAll().subscribe(data => this.clients = data);
    this.productoService.findAll().subscribe(data => this.productos = data);
  }

  close() {
    this._dialogRef.close();
  }

  operate() {
    if (this.sale && this.sale.idSale > 0) {
      // UPDATE
      this.saleService.update(this.sale.idSale, this.sale)
        .pipe(switchMap(() => this.saleService.findAll()))
        .subscribe(data => {
          this.saleService.setSaleChange(data);
          this.saleService.setMessageChange('UPDATED!');
        });
    } else {
      // INSERT
      this.saleService.save(this.sale)
        .pipe(switchMap(() => this.saleService.findAll()))
        .subscribe(data => {
          this.saleService.setSaleChange(data);
          this.saleService.setMessageChange('CREATED!');
        });
    }

    this.close();
  }
}
