import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { ProductoDialogComponent } from './product-dialog/product-dialog.component';
import { RouterOutlet } from '@angular/router';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Producto } from '../../model/producto';
import { ProductoService } from '../../services/product.service';
import { LoginService } from '../../services/login.service'; 
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { ProductoDetailDialogComponent } from './product-details-dialog/product-details-dialog.component';

@Component({
  selector: 'app-producto',
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
    CommonModule,
    MatInputModule
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductoComponent {
  dataSource: MatTableDataSource<Producto>;
  userRole: string = '';
   showActions: boolean = false;

  columnsDefinitions = [
    { def: 'idProduct', label: 'ID', hide: true },
    { def: 'nombre', label: 'Nombre', hide: false },
    { def: 'category', label: 'Categoría', hide: false },
    { def: 'precio', label: 'Precio', hide: false },
    { def: 'descripcion', label: 'Descripción', hide: false },
    { def: 'marca', label: 'Marca', hide: false },
    { def: 'talla', label: 'Talla', hide: false },
    { def: 'genero', label: 'Género', hide: false },
    { def: 'equipo', label: 'Equipo', hide: false },
    { def: 'imagen', label: 'Imagen', hide: false }, 
    { def: 'stock', label: 'Stock', hide: false },
      { def: 'details', label: 'Ver', hide: this.userRole === 'ROLE_ADMIN' }, // 👈
  { def: 'actions', label: 'Acciones', hide: this.userRole !== 'ROLE_ADMIN' } // 👈
    
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private productService: ProductoService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private loginService: LoginService
  ) { }

ngOnInit(): void {
    this.userRole = this.loginService.getRole();
    this.showActions = this.userRole === 'ROLE_ADMIN'; // ⬅️ Esto activa los botones solo si es admin

    this.productService.findAll().subscribe(data => {
      this.createTable(data);
    });

    this.productService.getProductChange().subscribe(data => this.createTable(data));

    this.productService.getMessageChange().subscribe(
      data =>
        this._snackBar.open(data, 'INFO', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        })
    );
  }

  createTable(data: Producto[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

getDisplayedColumns(): string[] {
  if (this.isAdmin()) {
    return this.columnsDefinitions.filter(c => !c.hide).map(c => c.def);
  } else {
    return ['nombre', 'category', 'precio', 'imagen', 'details'];
  }
}
viewDetails(product: Producto) {
  this._dialog.open(ProductoDetailDialogComponent, {
    width: '750px',
    data: { ...product, readOnly: true },
    autoFocus: true
  });
}

openDetails(product: Producto) {
  this._dialog.open(ProductoDetailDialogComponent, {
    width: '500px',
    data: product
  });
}




  delete(id: number) {
    this.productService.delete(id)
      .pipe(switchMap(() => this.productService.findAll()))
      .subscribe(data => {
        this.productService.setProductChange(data);
        this.productService.setMessageChange('Producto eliminado');
      });
  }

  openDialog(product?: Producto) {
    setTimeout(() => {
      this._dialog.open(ProductoDialogComponent, {
        width: '750px',
        data: product,
        autoFocus: true
      });
    });
  }

  // Permite verificar si el usuario es admin
  isAdmin(): boolean {
    return this.userRole === 'ROLE_ADMIN';
  }
}