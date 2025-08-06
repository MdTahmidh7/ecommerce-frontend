import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {ProductComponent} from './product/product.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import { AdminComponent } from './admin/admin.component';
import { CreateProductComponent } from './admin/create-product/create-product.component';

export const routes: Routes = [

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'about', component: AboutComponent },
  { path: 'products', component: ProductComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'create-product', component: CreateProductComponent }
    ]
  },
  { path: '**', redirectTo: '/home' }

];
