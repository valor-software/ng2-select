import { Component } from '@angular/core';
import {NgxSelectModule} from 'ngx-select-ex';
import {FormsModule} from '@angular/forms';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-no-autocomplete-demo',
  templateUrl: './no-autocomplete-demo.html',
  imports: [
    NgxSelectModule,
    FormsModule,
    JsonPipe
  ]
})
export class NoAutoCompleteDemoComponent {
    public _items: string[] = ['Amsterdam', 'Antwerp', 'Athens', 'Barcelona',
        'Berlin', 'Birmingham', 'Bradford', 'Bremen', 'Brussels', 'Bucharest',
        'Budapest', 'Cologne', 'Copenhagen', 'Dortmund', 'Dresden', 'Dublin',
        'Düsseldorf', 'Essen', 'Frankfurt', 'Genoa', 'Glasgow', 'Gothenburg',
        'Hamburg', 'Hannover', 'Helsinki', 'Kraków', 'Leeds', 'Leipzig', 'Lisbon',
        'London', 'Madrid', 'Manchester', 'Marseille', 'Milan', 'Munich', 'Málaga',
        'Naples', 'Palermo', 'Paris', 'Poznań', 'Prague', 'Riga', 'Rome',
        'Rotterdam', 'Seville', 'Sheffield', 'Sofia', 'Stockholm', 'Stuttgart',
        'The Hague', 'Turin', 'Valencia', 'Vienna', 'Vilnius', 'Warsaw', 'Wrocław',
        'Zagreb', 'Zaragoza', 'Łódź'];

    constructor() {
        const a = [];
        for (let i = 1; i <= 20; i++) {
            this._items.forEach(v => a.push(i + ' ' + v));
        }
        this.items = a;
    }

    public items: string[] = [];
    public ngxValue: any = [];
    public ngxDisabled = false;
}
