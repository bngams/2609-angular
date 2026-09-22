import { Component } from '@angular/core';
import { Home } from './home/home';
import { Header } from './header/header';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [Home, Header, RouterModule],
  template: `
    <main>
      <app-header></app-header>
      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styleUrls: ['./app.css'],
})
export class App {
  title = 'homes';

  doSomething() {
    const msg = "test";
    console.log(msg);
  }
}
