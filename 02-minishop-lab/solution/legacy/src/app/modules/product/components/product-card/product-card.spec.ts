import { TestBed } from '@angular/core/testing';
import { ProductCard } from './product-card';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

describe('ProductCard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductCard],
      imports: [MatCardModule, MatButtonModule],
    }).compileComponents();
  });

  it('devrait afficher le nom et le prix du produit', async () => {
    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentInstance.product = { name: 'Clavier', price: 89 };
    await fixture.whenStable();

    const html = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(html).toContain('Clavier');
    expect(html).toContain('89');
  });

  it('devrait émettre buy au clic sur BUY', async () => {
    const fixture = TestBed.createComponent(ProductCard);
    const product = { name: 'Souris', price: 45 };
    fixture.componentInstance.product = product;
    await fixture.whenStable();

    let emitted: unknown = null;
    fixture.componentInstance.buy.subscribe((p) => (emitted = p));

    (fixture.nativeElement as HTMLElement).querySelector('button')?.click();

    expect(emitted).toEqual(product);
  });
});
