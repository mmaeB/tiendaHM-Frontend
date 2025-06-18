import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../model/product';
import { switchMap } from 'rxjs';
import { CategoryService } from '../../../services/category.service';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../../model/category';

@Component({
  selector: 'app-product-edit',  
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    RouterLink,
    MatSelectModule
  ],
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
  export class ProductEditComponent implements OnInit {
    form: FormGroup;
    id: number;
    isEdit: boolean;

    constructor(
      private route: ActivatedRoute,
      private productService: ProductService,
      private categoryService: CategoryService,
      private router: Router
    ) {}


    categories: Category[] = [];

  ngOnInit(): void {
    this.form = new FormGroup({
    idProduct:new FormControl(),
    descripcion: new FormControl(''),
    equipo: new FormControl(''),
    genero: new FormControl(''),
    marca:  new FormControl(''),
    nombre: new FormControl(''),
    precio: new FormControl()  ,
    stock:new FormControl()  ,
    talla: new FormControl(''),
    category: new FormControl()  
    });
 
this.categoryService.findAll().subscribe(data => {
  console.log('Categories recibidas:', data);
  this.categories = data;
});
    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = this.id != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.isEdit) {
this.productService.findById(this.id).subscribe(data => {
  this.form.patchValue(data);
});

    }
  }

  operate() {
    const product: Product = {
      idProduct: this.form.value['idProduct'],
      descripcion:this.form.value['descripcion'],
      equipo:this.form.value['equipo'], 
      genero:this.form.value['genero'],
      marca: this.form.value['marca'],
      nombre:this.form.value['nombre'],
      precio:this.form.value['precio'],
      stock:this.form.value['stock'],
      talla: this.form.value['talla'], 
      category: this.form.value['category']
    };


    if (this.isEdit) {
      this.productService.update(this.id, product).subscribe(() => {
        this.productService.findAll().subscribe(data => {
          this.productService.setProductChange(data);
          this.productService.setMessageChange('Producto editado');
        });
      });
    } else {
      this.productService.save(product)
        .pipe(switchMap(() => this.productService.findAll()))
        .subscribe(data => {
          this.productService.setProductChange(data);
          this.productService.setMessageChange('Producto registrado');
        });
    }

    this.router.navigate(['pages/product']);
  }
}
