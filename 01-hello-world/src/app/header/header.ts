import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  template: `
    <header class="brand-name">
      <a [routerLink]="['/']">
        <img class="brand-logo" src="/public/logo.svg" alt="logo" aria-hidden="true" />
      </a>
    </header>
  `,
  styles: ``,
})
export class Header {}
