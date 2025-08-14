import {Component} from '@angular/core';
import {INgxSelectOption, NgxSelectModule} from 'ngx-select-ex';
import {FormsModule} from '@angular/forms';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-multiple-demo',
  templateUrl: './multiple-demo.html',
  imports: [
    NgxSelectModule,
    FormsModule,
    JsonPipe
  ]
})
export class MultipleDemoComponent {
  public items: string[] = ['Amsterdam', 'Antwerp', 'Athens', 'Barcelona',
    'Berlin', 'Birmingham', 'Bradford', 'Bremen', 'Brussels', 'Bucharest',
    'Budapest', 'Cologne', 'Copenhagen', 'Dortmund', 'Dresden', 'Dublin', 'Düsseldorf',
    'Essen', 'Frankfurt', 'Genoa', 'Glasgow', 'Gothenburg', 'Hamburg', 'Hannover',
    'Helsinki', 'Leeds', 'Leipzig', 'Lisbon', 'Łódź', 'London', 'Kraków', 'Madrid',
    'Málaga', 'Manchester', 'Marseille', 'Milan', 'Munich', 'Naples', 'Palermo',
    'Paris', 'Poznań', 'Prague', 'Riga', 'Rome', 'Rotterdam', 'Seville', 'Sheffield',
    'Sofia', 'Stockholm', 'Stuttgart', 'The Hague', 'Turin', 'Valencia', 'Vienna',
    'Vilnius', 'Warsaw', 'Wrocław', 'Zagreb', 'Zaragoza'];

  public ngxValue: any = [];
  public ngxDisabled = false;

  public doSelectOptions = (options: INgxSelectOption[]) => console.log('MultipleDemoComponent.doSelectOptions', options);
}
