import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDashboard } from './pages/product-dashboard/product-dashboard';

const routes: Routes = [
  { path: 'dashboard', component: ProductDashboard },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

// forChild : routes d'un module de fonctionnalité (forRoot est réservé à AppRoutingModule).
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
