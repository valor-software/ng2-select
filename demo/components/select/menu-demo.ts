/// <reference path="../../../tsd.d.ts" />

import {
  Component, View,
  CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass
} from 'angular2/angular2';

import {select} from '../../../components/index';

// webpack html imports
let template = require('./menu-demo.html');

@Component({
  selector: 'menu-demo'
})
@View({
  template: template,
  directives: [select, NgClass, CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class MenuDemo {
  private value:any = {};
  private items:Array<any> = [
    {
      id: '+00:00',
      text: 'Western European Time Zone',
      submenu: {
        items: [
          {id: 4, text: 'Barcelona'},
          {id: 6, text: 'Birmingham'},
          {id: 7, text: 'Bradford'},
          {id: 16, text: 'Dublin'},
          {id: 21, text: 'Glasgow'},
          {id: 26, text: 'Leeds'},
          {id: 28, text: 'Lisbon'},
          {id: 30, text: 'London'},
          {id: 32, text: 'Madrid'},
          {id: 33, text: 'Málaga'},
          {id: 34, text: 'Manchester'},
          {id: 46, text: 'Seville'},
          {id: 47, text: 'Sheffield'},
          {id: 53, text: 'Valencia'},
          {id: 59, text: 'Zaragoza'}
        ],
        showSearchInput: true
      }
    },
    {
      id: '+01:00',
      text: 'Central European Time Zone',
      submenu: {
        items: [
          {id: 1, text: 'Amsterdam'},
          {id: 2, text: 'Antwerp'},
          {id: 5, text: 'Berlin'},
          {id: 8, text: 'Bremen'},
          {id: 9, text: 'Brussels'},
          {id: 11, text: 'Budapest'},
          {id: 12, text: 'Cologne'},
          {id: 13, text: 'Copenhagen'},
          {id: 14, text: 'Dortmund'},
          {id: 15, text: 'Dresden'},
          {id: 17, text: 'Düsseldorf'},
          {id: 18, text: 'Essen'},
          {id: 19, text: 'Frankfurt'},
          {id: 20, text: 'Genoa'},
          {id: 22, text: 'Gothenburg'},
          {id: 23, text: 'Hamburg'},
          {id: 24, text: 'Hannover'},
          {id: 27, text: 'Leipzig'},
          {id: 29, text: 'Łódź'},
          {id: 31, text: 'Kraków'},
          {id: 35, text: 'Marseille'},
          {id: 36, text: 'Milan'},
          {id: 37, text: 'Munich'},
          {id: 38, text: 'Naples'},
          {id: 39, text: 'Palermo'},
          {id: 40, text: 'Paris'},
          {id: 41, text: 'Poznań'},
          {id: 42, text: 'Prague'},
          {id: 44, text: 'Rome'},
          {id: 45, text: 'Rotterdam'},
          {id: 49, text: 'Stockholm'},
          {id: 50, text: 'Stuttgart'},
          {id: 51, text: 'The Hague'},
          {id: 52, text: 'Turin'},
          {id: 54, text: 'Vienna'},
          {id: 56, text: 'Warsaw'},
          {id: 57, text: 'Wrocław'},
          {id: 58, text: 'Zagreb'}
        ],
        showSearchInput: true
      }
    },
    {
      id: '+02:00',
      text: 'Eastern European Time Zone',
      submenu: {
        items: [
          {id: 3, text: 'Athens'},
          {id: 10, text: 'Bucharest'},
          {id: 25, text: 'Helsinki'},
          {id: 43, text: 'Riga'},
          {id: 48, text: 'Sofia'},
          {id: 55, text: 'Vilnius'}
        ]
      }
    }
  ];

  private selected(value:any) {
    console.log('Selected value is: ', value);
  }

  private removed(value:any) {
    console.log('Removed value is: ', value);
  }

  private refreshValue(value:any) {
    this.value = value;
  }
}
