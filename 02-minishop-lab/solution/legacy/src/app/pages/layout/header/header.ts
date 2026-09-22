import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../../../modules/cart/services/cart';
import { AuthService } from '../../../modules/auth/services/auth';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  /** Flux consommés dans le template via le pipe async. */
  readonly count$: Observable<number>;
  readonly isLoggedIn$: Observable<boolean>;

  constructor(
    private auth: AuthService,
    private router: Router,
    private cart: CartService,
  ) {
    this.count$ = this.cart.count$;
    this.isLoggedIn$ = this.auth.isLoggedIn$;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/home']);
  }
}
