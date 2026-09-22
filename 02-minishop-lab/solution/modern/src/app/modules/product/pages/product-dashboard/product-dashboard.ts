import { Component, OnInit, inject, signal } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product';
import { CartService } from '../../../cart/services/cart';
import { ProductForm } from '../../components/product-form/product-form';
import { ProductList } from '../../components/product-list/product-list';

@Component({
  selector: 'app-product-dashboard',
  imports: [ProductForm, ProductList],
  templateUrl: './product-dashboard.html',
  styleUrl: './product-dashboard.scss',
})
export class ProductDashboard implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  /** État local de la page : la liste affichée. */
  readonly products = signal<Product[]>([]);

  /** Message d'erreur si l'API n'est pas joignable. */
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (products) => this.products.set(products),
      error: () => this.error.set("API injoignable : lancez `npm run serve-api`."),
    });
  }

  onAdd(product: Product): void {
    // Mise à jour optimiste : on affiche tout de suite, puis on persiste.
    this.products.update((list) => [...list, product]);
    this.productService.addProduct(product).subscribe({
      error: () => this.error.set("Le produit n'a pas pu être enregistré."),
    });
  }

  onBuy(product: Product): void {
    this.cartService.add(product);
  }
}
