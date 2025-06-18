import { Routes } from '@angular/router';
import { InventoryComponent } from './pages/inventory/inventory.component';

import { ProductComponent } from './pages/product/product.component';
import { ProductEditComponent } from './pages/product/product-edit/product-edit.component';


export const routes: Routes = [
  {
    path: 'pages/inventory', component: InventoryComponent
  },

  {
    path: 'pages/product',
    component: ProductComponent,
    children: [
      { path: 'new', component: ProductEditComponent },
      { path: 'edit/:id', component: ProductEditComponent }
    ]
  }

]