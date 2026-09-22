import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  /** Entrée : le produit affiché, fourni par le parent. */
  @Input({ required: true }) product!: Product;

  /** Sortie : remonte le produit au parent lors du clic sur BUY. */
  @Output() buy = new EventEmitter<Product>();
}
