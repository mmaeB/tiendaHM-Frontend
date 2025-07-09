import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Producto } from '../../../model/producto';
import { ProductoService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { InventoryService } from '../../../services/inventory.service';
import { Category } from '../../../model/category';
import { Inventory } from '../../../model/inventory';
import { switchMap } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producto-dialog',
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
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.css'
})
export class ProductoDialogComponent {
  producto: Producto;
  category: Category[] = [];
  inventory: Inventory[] = [];
  selectedFile: File | null = null;
imagePreview: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Producto,
    private _dialogRef: MatDialogRef<ProductoDialogComponent>,
    private productoService: ProductoService,
    private categoryService: CategoryService,
    private inventoryService: InventoryService
  ) {}

ngOnInit(): void {
  this.producto = { ...this.data };

  this.categoryService.findAll().subscribe(data => this.category = data);
  this.inventoryService.findAll().subscribe(data => this.inventory = data);

  if (this.producto.imagen) {
    this.imagePreview = 'http://localhost:9090/uploads/' + this.producto.imagen;
  }
}

  close() {
    this._dialogRef.close();
  }

onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}

operate() {
const formData = new FormData();

if (this.selectedFile) {
  formData.append('file', this.selectedFile);
}

formData.append(
  'producto',
  new Blob([JSON.stringify(this.producto)], { type: 'application/json' })
);

const request$ = this.producto.idProduct > 0
  ? this.productoService.updateWithImage(this.producto.idProduct, formData)
  : this.productoService.saveWithImage(formData);

request$
  .pipe(switchMap(() => this.productoService.findAll()))
  .subscribe(data => {
    this.productoService.setProductChange(data);
    this.productoService.setMessageChange(
      this.producto.idProduct > 0 ? 'UPDATED!' : 'CREATED!'
    );
    this.close();
  });


}
}
