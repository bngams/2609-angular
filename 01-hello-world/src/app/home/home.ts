import { Component, ViewChildren, QueryList, inject, ViewChild, ElementRef } from '@angular/core';
import { HousingLocation } from '../housing-location/housing-location';
import { HousingLocationInfo } from '../housinglocation';
import { HousingService } from '../housing-service';

@Component({
  selector: 'app-home',
  imports: [HousingLocation],
  template: `
    <section>
      <form>
        <input #cityInput type="text" name="search" placeholder="Filter by city" />
        <button class="primary" type="button" (click)="filterHousingLocationsByCity()">Search</button>
      </form>
    </section>
    <section class="results">
      @for (housingLocation of housingLocationList; track housingLocation.id) {
        <app-housing-location [home]="housingLocation" />
      }
    </section> 
  `,
  styleUrls: ['./home.css'],
})
export class Home {
  housingLocationList: HousingLocationInfo[] = [];
  housingService: HousingService = inject(HousingService);

  @ViewChild('cityInput') inputSearch!: ElementRef<HTMLInputElement>;


  constructor() {
    this.housingLocationList = this.housingService.getAllHousingLocations();
  }

  filterHousingLocationsByCity() {

    // with classic DOM => not recommanded
    // const cityInput: HTMLInputElement | null = document.querySelector('input[name="search"]');
    // const city = cityInput?.value ?? '';


    // with ViewChild => can be replaced by using Angular forms for better practice
    const city = this.inputSearch.nativeElement.value;
    this.housingLocationList = this.housingService.filterHousingLocationsByCity(city);
  }
  

  doSomethingWithMyService() {
    this.housingService.doSomething();
  }

  
}
