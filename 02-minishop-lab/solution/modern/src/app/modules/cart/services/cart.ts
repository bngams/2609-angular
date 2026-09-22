import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../../product/models/product';

@Injectable({ providedIn: 'root' })
export class CartService {
  /** Source de vérité : la liste des produits ajoutés au panier. */
  private readonly items = signal<Product[]>([]);

  /** Nombre d'articles, dérivé automatiquement de `items`. */
  readonly count = computed(() => this.items().length);

  add(product: Product): void {
    this.items.update((list) => [...list, product]);
  }

  clear(): void {
    this.items.set([]);
  }
}
