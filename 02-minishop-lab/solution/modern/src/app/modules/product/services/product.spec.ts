import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from './product';
import { Product } from '../models/product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Vérifie qu'aucune requête déclarée n'a été oubliée.
  afterEach(() => httpMock.verify());

  it('getProducts devrait appeler GET /products et renvoyer la liste', () => {
    const fake: Product[] = [{ id: 1, name: 'Clavier', price: 89 }];
    let received: Product[] | undefined;

    service.getProducts().subscribe((products) => (received = products));

    const req = httpMock.expectOne('http://localhost:3004/products');
    expect(req.request.method).toBe('GET');

    // On décide nous-mêmes de la réponse : aucun vrai serveur n'est appelé.
    req.flush(fake);

    expect(received).toEqual(fake);
  });
});
