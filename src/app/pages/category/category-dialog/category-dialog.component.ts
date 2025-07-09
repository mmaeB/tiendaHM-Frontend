import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../../model/category';
import { CategoryService } from '../../../services/category.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-category-dialog',
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
  templateUrl: './category-dialog.component.html',
  styleUrl: './category-dialog.component.css'
})
export class CategoryDialogComponent {
  category: Category = {
    idCategory: 0,
    nombre: '',
    descripcion: '',
    estado: true
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Category,
    private _dialogRef: MatDialogRef<CategoryDialogComponent>,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.category = { ...this.data };
  }

  close(): void {
    this._dialogRef.close();
  }

  operate(): void {
    if (this.category && this.category.idCategory > 0) {
      this.categoryService.update(this.category.idCategory, this.category)
        .pipe(switchMap(() => this.categoryService.findAll()))
        .subscribe(data => {
          this.categoryService.setCategoryChange(data);
          this.categoryService.setMessageChange('¡Categoría actualizada!');
        });
    } else {
      this.categoryService.save(this.category)
        .pipe(switchMap(() => this.categoryService.findAll()))
        .subscribe(data => {
          this.categoryService.setCategoryChange(data);
          this.categoryService.setMessageChange('¡Categoría registrada!');
        });
    }

    this.close();
  }
}
