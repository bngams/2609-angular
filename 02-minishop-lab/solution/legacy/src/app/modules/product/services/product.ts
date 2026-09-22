import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

const API_URL = 'http://localhost:3004/products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  // Injection par constructeur : la forme historique, toujours valide.
  constructor(private httpClient: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(API_URL);
  }

  addProduct(product: Product): Observable<Product> {
    return this.httpClient.post<Product>(API_URL, product);
  }
}
