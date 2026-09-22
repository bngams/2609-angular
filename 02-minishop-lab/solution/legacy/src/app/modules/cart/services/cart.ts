import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Product } from '../../product/models/product';

@Injectable({ providedIn: 'root' })
export class CartService {
  /** BehaviorSubject : conserve la dernière valeur et la rejoue aux abonnés. */
  private readonly items = new BehaviorSubject<Product[]>([]);

  /** Exposé en lecture seule, dérivé avec l'opérateur map. */
  readonly count$: Observable<number> = this.items.pipe(map((list) => list.length));

  add(product: Product): void {
    this.items.next([...this.items.value, product]);
  }

  clear(): void {
    this.items.next([]);
  }
}
