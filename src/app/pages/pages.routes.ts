import { Routes } from "@angular/router";
import { CategoryComponent } from "./category/category.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { SaleComponent } from "./sale/sale.component";
import { BookingComponent } from "./booking/booking.component";
import { ProductoComponent } from "./product/product.component";
import { InventoryComponent } from "./inventory/inventory.component";
import { ClientComponent } from "./client/client.component";

export const pagesRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent},
    { path: 'booking',  component: BookingComponent},
    { path: 'category', component: CategoryComponent },
    { path: 'sale', component: SaleComponent },    
    { path: 'product', component: ProductoComponent },
    { path: 'inventory', component: InventoryComponent },
    { path: 'client', component: ClientComponent }
]