import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

/**
 * Laisse passer si l'utilisateur est connecté,
 * sinon renvoie une UrlTree => le routeur redirige vers /auth/login.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn ? true : router.createUrlTree(['/auth/login']);
};
