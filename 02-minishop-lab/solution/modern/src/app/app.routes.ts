import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { NotFound } from './pages/not-found/not-found';
import { authGuard } from './modules/auth/guards/auth-guard';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'about', component: About },

  // Lazy loading : le code de la feature n'est téléchargé qu'à la 1re visite.
  {
    path: 'products',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/product/product.routes').then((m) => m.PRODUCT_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: NotFound },
];
