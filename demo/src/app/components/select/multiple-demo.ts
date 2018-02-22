import { Component } from '@angular/core';
import { MultipleDisplayMode } from 'ng2-select';

@Component({
  selector: 'multiple-demo',
  templateUrl: './multiple-demo.html'
})
export class MultipleDemoComponent {
  public items:Array<string> = ['Amsterdam', 'Antwerp', 'Athens', 'Barcelona',
    'Berlin', 'Birmingham', 'Bradford', 'Bremen', 'Brussels', 'Bucharest',
    'Budapest', 'Cologne', 'Copenhagen', 'Dortmund', 'Dresden', 'Dublin', 'Düsseldorf',
    'Essen', 'Frankfurt', 'Genoa', 'Glasgow', 'Gothenburg', 'Hamburg', 'Hannover',
    'Helsinki', 'Leeds', 'Leipzig', 'Lisbon', 'Łódź', 'London', 'Kraków', 'Madrid',
    'Málaga', 'Manchester', 'Marseille', 'Milan', 'Munich', 'Naples', 'Palermo',
    'Paris', 'Poznań', 'Prague', 'Riga', 'Rome', 'Rotterdam', 'Seville', 'Sheffield',
    'Sofia', 'Stockholm', 'Stuttgart', 'The Hague', 'Turin', 'Valencia', 'Vienna',
    'Vilnius', 'Warsaw', 'Wrocław', 'Zagreb', 'Zaragoza'];

  public value:any = ['Athens'];
  public _disabledV:string = '0';
  public disabled:boolean = false;
  public multipleDisplayMode: MultipleDisplayMode = MultipleDisplayMode.Checkbox;
  public selectedDisplayMode: string = '';

  constructor() {
    this.selectedDisplayMode = MultipleDisplayMode[MultipleDisplayMode.Checkbox];
  }

  public get disabledV():string {
    return this._disabledV;
  }

  public set disabledV(value:string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  public selected(value:any):void {
    console.log('Selected value is: ', value);
  }

  public removed(value:any):void {
    console.log('Removed value is: ', value);
  }

  public refreshValue(value:any):void {
    console.log('Refreshed value is: ', value);
    this.value = value;
  }

  public itemsToString(value:any[] = []):string {
    return value.map(item => item.text).join(',');
  }

  public toggleMultipleMode(): void {
    if (this.multipleDisplayMode === MultipleDisplayMode.Checkbox) {
      this.multipleDisplayMode = MultipleDisplayMode.Default;
      this.selectedDisplayMode = MultipleDisplayMode[this.multipleDisplayMode];
      return;
    }

    if (this.multipleDisplayMode === MultipleDisplayMode.Default) {
      this.multipleDisplayMode = MultipleDisplayMode.Checkbox;
      this.selectedDisplayMode = MultipleDisplayMode[this.multipleDisplayMode];
      return;
    }
  }
}
