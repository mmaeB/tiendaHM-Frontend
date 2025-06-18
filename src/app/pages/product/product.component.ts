import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/product';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import {
  MatFormFieldModule
} from '@angular/material/form-field';
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
  selector: 'app-book',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
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
export class ProductComponent implements OnInit {
  dataSource: MatTableDataSource<Product>;
  
columnsDefinitions = [
    { def: 'nombre', label: 'Nombre', hide: false },
    { def: 'marca', label: 'Marca', hide: false },
    { def: 'precio', label: 'Precio', hide: false },
    { def: 'stock', label: 'Stock', hide: false },  
    { def: 'actions', label: 'Acciones', hide: false }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private productService: ProductService,
    private snackBar: MatSnackBar

  ){}
  //publisherService = inject(PublisherService);

  ngOnInit(): void {
    // this.publisherService.findAll().subscribe(data => console.log(data));
    // this.publisherService.findAll().subscribe(data => this.publishers = data);
    this.productService.findAll().subscribe((data) => {
        this.createTable(data)
    });

  
   this.productService.getMessageChange().subscribe(data => {
  this.snackBar.open(data, 'INFO', {
    duration: 2000,
    horizontalPosition: 'right',
    verticalPosition: 'bottom',
  });
});

}


  //Metodo de creación de la tabla
  createTable(data){
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();
  }


  //metodo para eliminar
  delete(id: number){
    this.productService.delete(id)
    .pipe(switchMap(()=> this.productService.findAll()))
    .subscribe(data=>{
      this.productService.setProductChange(data);
      this.productService.setMessageChange('Producto Eliminado');
    }) 
  }
}
