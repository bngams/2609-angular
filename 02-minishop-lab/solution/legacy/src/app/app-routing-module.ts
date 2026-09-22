import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { NotFound } from './pages/not-found/not-found';
import { authGuard } from './modules/auth/guards/auth-guard';

const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'about', component: About },

  // Lazy loading : le module n'est téléchargé qu'à la 1re visite de /products.
  {
    path: 'products',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/product/product-module').then((m) => m.ProductModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth-module').then((m) => m.AuthModule),
  },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: NotFound },
];

// forRoot : configuration du routeur pour toute l'application (une seule fois).
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
