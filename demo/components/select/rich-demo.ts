import {
    Component,
    OnInit,
    ViewEncapsulation
} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass} from 'angular2/common';
import {ButtonCheckbox} from 'ng2-bootstrap/ng2-bootstrap';

import {SELECT_DIRECTIVES} from '../../../ng2-select';

// webpack html imports
let template = require('./rich-demo.html');

@Component({
  selector: 'rich-demo',
  template: template,
  styles: [`colorbox,.colorbox { display:inline-block; height:14px; width:14px;margin-right:4px; border:1px solid #000;}`],
  directives: [SELECT_DIRECTIVES, NgClass, CORE_DIRECTIVES, FORM_DIRECTIVES, ButtonCheckbox],
  encapsulation: ViewEncapsulation.None  // Enable dynamic HTML styles
})
export class RichDemo implements OnInit {
  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;
  private items:Array<any> = [];

  ngOnInit() {
    COLORS.forEach( c => {
      this.items.push( {
        id  : c.hex,
        text: "<colorbox style='background-color:"+c.hex+";'></colorbox>"+c.name+" ("+c.hex+")"
      });
    });
  }

  private get disabledV():string {
    return this._disabledV;
  }

  private set disabledV(value:string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  private selected(value:any) {
    console.log('Selected value is: ', value);
  }

  private removed(value:any) {
    console.log('Removed value is: ', value);
  }

  private typed(value:any) {
    console.log('New search input: ', value);
  }

  private refreshValue(value:any) {
    this.value = value;
  }
}

const COLORS = [
    { 'name': 'Blue 10',       'hex': '#C0E6FF' },
    { 'name': 'Blue 20',       'hex': '#7CC7FF' },
    { 'name': 'Blue 30',       'hex': '#5AAAFA' },
    { 'name': 'Blue 40',       'hex': '#5596E6' },
    { 'name': 'Blue 50',       'hex': '#4178BE' },
    { 'name': 'Blue 60',       'hex': '#325C80' },
    { 'name': 'Blue 70',       'hex': '#264A60' },
    { 'name': 'Blue 80',       'hex': '#1D3649' },
    { 'name': 'Blue 90',       'hex': '#152935' },
    { 'name': 'Blue 100',      'hex': '#010205' },
    { 'name': 'Green 10',      'hex': '#C8F08F' },
    { 'name': 'Green 20',      'hex': '#B4E051' },
    { 'name': 'Green 30',      'hex': '#8CD211' },
    { 'name': 'Green 40',      'hex': '#5AA700' },
    { 'name': 'Green 50',      'hex': '#4B8400' },
    { 'name': 'Green 60',      'hex': '#2D660A' },
    { 'name': 'Green 70',      'hex': '#144D14' },
    { 'name': 'Green 80',      'hex': '#0A3C02' },
    { 'name': 'Green 90',      'hex': '#0C2808' },
    { 'name': 'Green 100',     'hex': '#010200' },
    { 'name': 'Teal 10',       'hex': '#A7FAE6' },
    { 'name': 'Teal 20',       'hex': '#6EEDD8' },
    { 'name': 'Teal 30',       'hex': '#41D6C3' },
    { 'name': 'Teal 40',       'hex': '#00B4A0' },
    { 'name': 'Teal 50',       'hex': '#008571' },
    { 'name': 'Teal 60',       'hex': '#006D5D' },
    { 'name': 'Teal 70',       'hex': '#005448' },
    { 'name': 'Teal 80',       'hex': '#003C32' },
    { 'name': 'Teal 90',       'hex': '#012B22' },
    { 'name': 'Teal 100',      'hex': '#000202' },
    { 'name': 'Purple 10',     'hex': '#EED2FF' },
    { 'name': 'Purple 20',     'hex': '#D7AAFF' },
    { 'name': 'Purple 30',     'hex': '#BA8FF7' },
    { 'name': 'Purple 40',     'hex': '#AF6EE8' },
    { 'name': 'Purple 50',     'hex': '#9855D4' },
    { 'name': 'Purple 60',     'hex': '#734098' },
    { 'name': 'Purple 70',     'hex': '#562F72' },
    { 'name': 'Purple 80',     'hex': '#412356' },
    { 'name': 'Purple 90',     'hex': '#311A41' },
    { 'name': 'Purple 100',    'hex': '#030103' },
    { 'name': 'Magenta 10',    'hex': '#FFD2FF' },
    { 'name': 'Magenta 20',    'hex': '#FF9EEE' },
    { 'name': 'Magenta 30',    'hex': '#FF71D4' },
    { 'name': 'Magenta 40',    'hex': '#FF3CA0' },
    { 'name': 'Magenta 50',    'hex': '#DB2780' },
    { 'name': 'Magenta 60',    'hex': '#A6266E' },
    { 'name': 'Magenta 70',    'hex': '#7C1C58' },
    { 'name': 'Magenta 80',    'hex': '#601146' },
    { 'name': 'Magenta 90',    'hex': '#3A0B2E' },
    { 'name': 'Magenta 100',   'hex': '#040102' },
    { 'name': 'Red 10',        'hex': '#FFD2DD' },
    { 'name': 'Red 20',        'hex': '#FFA5B4' },
    { 'name': 'Red 30',        'hex': '#FF7D87' },
    { 'name': 'Red 40',        'hex': '#FF5050' },
    { 'name': 'Red 50',        'hex': '#E71D32' },
    { 'name': 'Red 60',        'hex': '#AD1625' },
    { 'name': 'Red 70',        'hex': '#8C101C' },
    { 'name': 'Red 80',        'hex': '#6E0A1E' },
    { 'name': 'Red 90',        'hex': '#4C0A17' },
    { 'name': 'Red 100',       'hex': '#040001' },
    { 'name': 'Orange 10',     'hex': '#FFD791' },
    { 'name': 'Orange 20',     'hex': '#FFA573' },
    { 'name': 'Orange 30',     'hex': '#FF7832' },
    { 'name': 'Orange 40',     'hex': '#FF5003' },
    { 'name': 'Orange 50',     'hex': '#D74108' },
    { 'name': 'Orange 60',     'hex': '#A53725' },
    { 'name': 'Orange 70',     'hex': '#872A0F' },
    { 'name': 'Orange 80',     'hex': '#6D120F' },
    { 'name': 'Orange 90',     'hex': '#43100B' },
    { 'name': 'Orange 100',    'hex': '#030100' },
    { 'name': 'Yellow 10',     'hex': '#FDE876' },
    { 'name': 'Yellow 20',     'hex': '#FDD600' },
    { 'name': 'Yellow 30',     'hex': '#EFC100' },
    { 'name': 'Yellow 40',     'hex': '#BE9B00' },
    { 'name': 'Yellow 50',     'hex': '#8C7300' },
    { 'name': 'Yellow 60',     'hex': '#735F00' },
    { 'name': 'Yellow 70',     'hex': '#574A00' },
    { 'name': 'Yellow 80',     'hex': '#3C3200' },
    { 'name': 'Yellow 90',     'hex': '#281E00' },
    { 'name': 'Yellow 100',    'hex': '#020100' },
    { 'name': 'Gray 10',       'hex': '#E0E0E0' },
    { 'name': 'Gray 20',       'hex': '#C7C7C7' },
    { 'name': 'Gray 30',       'hex': '#AEAEAE' },
    { 'name': 'Gray 40',       'hex': '#959595' },
    { 'name': 'Gray 50',       'hex': '#777677' },
    { 'name': 'Gray 60',       'hex': '#5A5A5A' },
    { 'name': 'Gray 70',       'hex': '#464646' },
    { 'name': 'Gray 80',       'hex': '#323232' },
    { 'name': 'Gray 90',       'hex': '#121212' },
    { 'name': 'Gray 100',      'hex': '#000000' },
    { 'name': 'Cool-Gray 10',  'hex': '#DFE9E9' },
    { 'name': 'Cool-Gray 20',  'hex': '#C8D2D2' },
    { 'name': 'Cool-Gray 30',  'hex': '#AEB8B8' },
    { 'name': 'Cool-Gray 40',  'hex': '#959F9F' },
    { 'name': 'Cool-Gray 50',  'hex': '#6D7777' },
    { 'name': 'Cool-Gray 60',  'hex': '#586464' },
    { 'name': 'Cool-Gray 70',  'hex': '#3C4646' },
    { 'name': 'Cool-Gray 80',  'hex': '#2D3737' },
    { 'name': 'Cool-Gray 90',  'hex': '#0D1111' },
    { 'name': 'Cool-Gray 100', 'hex': '#000203' },
    { 'name': 'Warm-Gray 10',  'hex': '#E9E0E0' },
    { 'name': 'Warm-Gray 20',  'hex': '#D0C7C7' },
    { 'name': 'Warm-Gray 30',  'hex': '#B8AEAE' },
    { 'name': 'Warm-Gray 40',  'hex': '#9E9494' },
    { 'name': 'Warm-Gray 50',  'hex': '#7D7373' },
    { 'name': 'Warm-Gray 60',  'hex': '#645A5A' },
    { 'name': 'Warm-Gray 70',  'hex': '#504646' },
    { 'name': 'Warm-Gray 80',  'hex': '#3C3232' },
    { 'name': 'Warm-Gray 90',  'hex': '#1A1314' },
    { 'name': 'Warm-Gray 100', 'hex': '#030000' }
]