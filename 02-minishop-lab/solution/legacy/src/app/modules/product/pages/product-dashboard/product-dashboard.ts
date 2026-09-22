import { Component, OnInit } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product';
import { CartService } from '../../../cart/services/cart';

@Component({
  selector: 'app-product-dashboard',
  standalone: false,
  templateUrl: './product-dashboard.html',
  styleUrl: './product-dashboard.scss',
})
export class ProductDashboard implements OnInit {
  /** Flux consommé dans le template via le pipe async. */
  products$!: Observable<Product[]>;

  /** Produits ajoutés localement (non encore rechargés depuis l'API). */
  localProducts: Product[] = [];

  error: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.products$ = this.productService.getProducts().pipe(
      catchError(() => {
        this.error = "API injoignable : lancez `npm run serve-api`.";
        return of([]);
      }),
    );
  }

  onAdd(product: Product): void {
    this.localProducts = [...this.localProducts, product];
    this.productService.addProduct(product).subscribe({
      error: () => (this.error = "Le produit n'a pas pu être enregistré."),
    });
  }

  onBuy(product: Product): void {
    this.cartService.add(product);
  }
}
