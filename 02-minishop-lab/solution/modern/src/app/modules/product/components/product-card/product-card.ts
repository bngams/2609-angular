import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-card',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  /** Produit affiché par la carte (entrée obligatoire). */
  readonly product = input.required<Product>();

  /** Émis quand l'utilisateur clique sur BUY. */
  readonly buy = output<Product>();
}
