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
import { Category } from '../../model/category';
import { CategoryService } from '../../services/category.service';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';

@Component({
  selector: 'app-category',
  standalone: true,
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
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
  ]
})
export class CategoryComponent {
  dataSource: MatTableDataSource<Category>;

  columnsDefinitions = [
    { def: 'idCategory', label: 'ID', hide: true },
    { def: 'nombre', label: 'Nombre', hide: false },
    { def: 'descripcion', label: 'Descripción', hide: false },
    { def: 'estado', label: 'Estado', hide: false },
    { def: 'actions', label: 'Acciones', hide: false }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private categoryService: CategoryService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.categoryService.findAll().subscribe(data => this.createTable(data));
    this.categoryService.getCategoryChange().subscribe(data => this.createTable(data));
    this.categoryService.getMessageChange().subscribe(msg =>
      this._snackBar.open(msg, 'INFO', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      })
    );
  }

  createTable(data: Category[]): void {
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
    this.categoryService.delete(id)
      .pipe(switchMap(() => this.categoryService.findAll()))
      .subscribe(data => {
        this.categoryService.setCategoryChange(data);
        this.categoryService.setMessageChange('¡Categoría eliminada!');
      });
  }

  openDialog(category?: Category): void {
    this._dialog.open(CategoryDialogComponent, {
      width: '600px',
      data: category,
      autoFocus: true
    });
  }
}
