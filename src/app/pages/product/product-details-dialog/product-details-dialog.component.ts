import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Producto } from '../../../model/producto';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-producto-detail-dialog',
  standalone: true,
  templateUrl: './product-details-dialog.component.html',
  styleUrl: './product-details-dialog.component.css',
  imports: [
    CommonModule,
    MatDialogModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class ProductoDetailDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public producto: Producto) {}
}
