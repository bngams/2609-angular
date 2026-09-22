import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ProductRoutingModule } from './product-routing-module';
import { MaterialModule } from '../../material-module';
import { ProductDashboard } from './pages/product-dashboard/product-dashboard';
import { ProductList } from './components/product-list/product-list';
import { ProductCard } from './components/product-card/product-card';
import { ProductForm } from './components/product-form/product-form';

@NgModule({
  declarations: [ProductDashboard, ProductList, ProductCard, ProductForm],
  imports: [CommonModule, ReactiveFormsModule, ProductRoutingModule, MaterialModule],
})
export class ProductModule {}
