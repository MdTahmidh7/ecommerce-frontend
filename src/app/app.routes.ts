import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {ProductComponent} from './product/product.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {AdminComponent} from './admin/admin.component';
import {CreateProductComponent} from './admin/create-product/create-product.component';
import {AdminLoginComponent} from './admin/login/login.component';
import {MyOrdersComponent} from './my-orders/my-orders.component';
import {AdminOrdersComponent} from './admin/admin-orders/admin-orders.component';
import {OrderDetailsComponent} from './admin/order-details/order-details.component';
import {MyOrdersDetailsComponent} from './my-orders-details/my-orders-details.component';
import {AdminProductsComponent} from './admin/admin-products/admin-products.component';
import {UpdateProductComponent} from './admin/update-product/update-product.component';
import {DashboardComponent} from './admin/dashboard/dashboard.component';
import {RoleAuthGuard} from './admin/role-auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'about', component: AboutComponent },
  { path: 'products', component: ProductComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'my-orders',
    component: MyOrdersComponent,
    canActivate: [RoleAuthGuard],
    data: { roles: ['ROLE_USER']}
  },
  { path: 'my-orders/:id',
    component: MyOrdersDetailsComponent,
    canActivate: [RoleAuthGuard],
    data: { roles: ['ROLE_USER']}
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [RoleAuthGuard],
    data: { roles: ['ROLE_ADMIN'] },
    children: [
      { path: 'create-product', component: CreateProductComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'orders/:id', component: OrderDetailsComponent },
      { path: 'update-products/:id', component: UpdateProductComponent },
      { path: 'analytics', component:DashboardComponent},
      { path: 'products', component: AdminProductsComponent},
    ]
  },
  { path: '**', redirectTo: '/home' }
];
