import { Routes } from '@angular/router';
import { ProductDashboard } from './pages/product-dashboard/product-dashboard';

/**
 * Routes internes de la feature Product.
 * Elles sont préfixées par le chemin déclaré dans app.routes.ts (/products).
 */
export const PRODUCT_ROUTES: Routes = [
  { path: 'dashboard', component: ProductDashboard },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
