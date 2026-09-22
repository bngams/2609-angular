import { Service, signal } from "@angular/core";
import { HousingLocationInfo } from "./housinglocation";
import { HOUSING_LOCATION_LIST_MOCK } from "./housing-location.mock";

@Service()
export class HousingService {
    housingLocationList: HousingLocationInfo[] = HOUSING_LOCATION_LIST_MOCK;
    
    myDynamicValue = signal<string>('Some Value');

    getAllHousingLocations(): HousingLocationInfo[] {
        return this.housingLocationList;
    }

    getHousingLocationById(id: number): HousingLocationInfo | undefined {
        return this.housingLocationList.find((housingLocation) => housingLocation.id === id);
    }

    filterHousingLocationsByCity(city: string): HousingLocationInfo[] {
        return this.housingLocationList.filter((housingLocation) => {
            return housingLocation.city.toLowerCase().includes(city.toLowerCase());
        });
    }

    submitApplication(firstName: string, lastName: string, email: string) {
        console.log(
            `Homes application received: firstName: ${firstName}, lastName: ${lastName}, email: ${email}.`,
        );
    }

    doSomething() {
        const msg = "test";
        console.log(msg);
    }

    private doSomethingPrivate() {
        const msg = "private test";
        console.log(msg);
    }
}
