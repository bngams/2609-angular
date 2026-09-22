import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { App } from './app';
import { Header } from './pages/layout/header/header';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [App, Header],
      // On importe les modules Material directement : dans un TestBed,
      // passer par MaterialModule ne suffit pas.
      imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatBadgeModule,
        RouterModule.forRoot([]),
      ],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  it("devrait créer l'application", () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
