import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import random from '@angular-devkit/schematics/src/rules/random';

@Component({
  selector: 'single-demo',
  templateUrl: './single-demo.html'
})
export class SingleDemoComponent implements OnInit, OnDestroy {
  public items: string[] = ['Amsterdam', 'Antwerp', 'Athens', 'Barcelona',
    'Berlin', 'Birmingham', 'Bradford', 'Bremen', 'Brussels', 'Bucharest',
    'Budapest', 'Cologne', 'Copenhagen', 'Dortmund', 'Dresden', 'Dublin',
    'Düsseldorf', 'Essen', 'Frankfurt', 'Genoa', 'Glasgow', 'Gothenburg',
    'Hamburg', 'Hannover', 'Helsinki', 'Kraków', 'Leeds', 'Leipzig', 'Lisbon',
    'London', 'Madrid', 'Manchester', 'Marseille', 'Milan', 'Munich', 'Málaga',
    'Naples', 'Palermo', 'Paris', 'Poznań', 'Prague', 'Riga', 'Rome',
    'Rotterdam', 'Seville', 'Sheffield', 'Sofia', 'Stockholm', 'Stuttgart',
    'The Hague', 'Turin', 'Valencia', 'Vienna', 'Vilnius', 'Warsaw', 'Wrocław',
    'Zagreb', 'Zaragoza', 'Łódź'];

  public ngControl = new FormControl();
  public ngxControl = new FormControl();

  // public ngxDefault = 'Bradford';

  private _ngxDefaultInterval;
  private _ngxDefault;

  constructor() {
    setTimeout(() => {
      this._ngxDefaultInterval = setInterval(() => {
        const idx = Math.floor(Math.random() * (this.items.length - 1));
        this._ngxDefault = this.items[idx];
        // console.log('new default value = ', this._ngxDefault);
      }, 2000);
    }, 2000);
  }

  ngOnInit(): void {
    // this.ngxControl.valueChanges.subscribe(_ => console.log('ngxControl.valueChange', _));
  }

  ngOnDestroy(): void {
    clearInterval(this._ngxDefaultInterval);
  }

  public doNgxDefault(): any {
    return this._ngxDefault;
  }

  public inputTyped(source: string, text: string) {
    console.log('SingleDemoComponent.inputTyped', source, text);
  }
}
