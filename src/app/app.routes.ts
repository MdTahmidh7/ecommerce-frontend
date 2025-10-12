import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProductComponent } from './product/product.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { AdminComponent } from './admin/admin.component';
import { CreateProductComponent } from './admin/create-product/create-product.component';
import { AdminLoginComponent } from './admin/login/login.component';
import { AuthGuard } from './admin/auth.guard';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import {OrderDetailsComponent} from './admin/order-details/order-details.component';
import {MyOrdersDetailsComponent} from './my-orders-details/my-orders-details.component';
import {AdminProductsComponent} from './admin/admin-products/admin-products.component';
import {UpdateProductComponent} from './admin/update-product/update-product.component';
import {DashboardComponent} from './admin/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'about', component: AboutComponent },
  { path: 'products', component: ProductComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'my-orders', component: MyOrdersComponent },
  { path: 'my-orders/:id', component: MyOrdersDetailsComponent },
  { path: 'admin/login', component: AdminLoginComponent },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'create-product', component: CreateProductComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'admin/orders/:id', component: OrderDetailsComponent },
      { path: 'admin/update-products/:id', component: UpdateProductComponent },
      { path: 'admin/analytics', component:DashboardComponent},
      { path: 'admin/products', component: AdminProductsComponent},
    ]
  },
  { path: '**', redirectTo: '/home' }
];
