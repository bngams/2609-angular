import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HousingService } from '../housing-service';
import { HousingLocationInfo } from '../housinglocation';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-details',
  styles: `
    .listing-photo {
      height: 600px;
      width: 50%;
      object-fit: cover;
      border-radius: 30px;
      float: right;
    }

    .listing-heading {
      font-size: 48pt;
      font-weight: bold;
      margin-bottom: 15px;
    }

    .listing-location::before {
      content: url('/public/location-pin.svg') / '';
    }

    .listing-location {
      font-size: 24pt;
      margin-bottom: 15px;
    }

    .listing-features > .section-heading {
      color: var(--secondary-color);
      font-size: 24pt;
      margin-bottom: 15px;
    }

    .listing-features {
      margin-bottom: 20px;
    }

    .listing-features li {
      font-size: 14pt;
    }

    li {
      list-style-type: none;
    }

    .listing-apply .section-heading {
      font-size: 18pt;
      margin-bottom: 15px;
    }

    label,
    input {
      display: block;
    }
    label {
      color: var(--secondary-color);
      font-weight: bold;
      text-transform: uppercase;
      font-size: 12pt;
    }
    input {
      font-size: 16pt;
      margin-bottom: 15px;
      padding: 10px;
      width: 400px;
      border-top: none;
      border-right: none;
      border-left: none;
      border-bottom: solid 0.3px;
    }
    @media (max-width: 1024px) {
      .listing-photo {
        width: 100%;
        height: 400px;
      }
    }
  `,
  template: `
    <article>
      <img
        class="listing-photo"
        [src]="housingLocation?.photo"
        alt="Exterior photo of {{ housingLocation?.name }}"
        crossorigin
      />
      <section class="listing-description">
        <h2 class="listing-heading">{{ housingLocation?.name }}</h2>
        <p class="listing-location">{{ housingLocation?.city }}, {{ housingLocation?.state }}</p>
      </section>
      <section class="listing-features">
        <h2 class="section-heading">About this housing location</h2>
        <ul>
          <li>Units available: {{ housingLocation?.availableUnits }}</li>
          <li>Does this location have wifi: {{ housingLocation?.wifi }}</li>
          <li>Does this location have laundry: {{ housingLocation?.laundry }}</li>
        </ul>
      </section>
      <section class="listing-apply">
        <h2 class="section-heading">Apply now to live here</h2>
        <form [formGroup]="applyForm" (submit)="submitApplication()">
          <label for="first-name">First Name</label>
          <input id="first-name" type="text" formControlName="firstName" />

          <label for="last-name">Last Name</label>
          <input id="last-name" type="text" formControlName="lastName" />

          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email" />
          <button type="submit" class="primary">Apply now</button>
        </form>
      </section>
    </article>
  `,
})
export class Details {
  route: ActivatedRoute = inject(ActivatedRoute);
  housingLocationId = -1;
  housingLocation: HousingLocationInfo | null | undefined = null;
  housingService = inject(HousingService);
  
  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
  });

  constructor() {
    this.housingLocationId = Number(this.route.snapshot.params['id']);
    this.housingLocation = this.housingService.getHousingLocationById(this.housingLocationId);
  }

  submitApplication() {
    this.housingService.submitApplication(
      this.applyForm.value.firstName ?? '',
      this.applyForm.value.lastName ?? '',
      this.applyForm.value.email ?? '',
    );
  }

}
