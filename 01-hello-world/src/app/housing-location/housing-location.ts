import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HousingLocationInfo } from '../housinglocation';

// <app-housing-location [home]="someHome"></app-housing-location>
@Component({
  selector: 'app-housing-location',
  imports: [RouterModule], 
  template: `
    <section class="listing">
      <img
        class="listing-photo"
        [src]="home().photo"
        alt="Exterior photo of {{ home().name }}"
        crossorigin
      />
      <h2 class="listing-heading">{{ home().name }}</h2>
      <p class="listing-location">{{ home().city }}, {{ home().state }}</p>
      <a [routerLink]="['/details', home().id]">Learn More</a>
    </section>
  `,
  styleUrls: ['./housing-location.css'],
})
export class HousingLocation {
  // maison a afficher => input
  home = input.required<HousingLocationInfo>();

  public doSomething() {
    const msg = "test";
    console.log(msg);
  }

  private doSomethingPrivate() {
    const msg = "private test";
    console.log(msg);
  }
}
