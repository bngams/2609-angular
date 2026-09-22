import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

const API_URL = 'http://localhost:3004/products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  /** Récupère la liste des produits depuis l'API. */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(API_URL);
  }

  /** Ajoute un produit côté serveur. */
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(API_URL, product);
  }
}
