import { Component } from '@angular/core';

@Component({
  selector: 'disabled-demo',
  templateUrl: './disabled-demo.html'
})
export class DisabledDemoComponent {
  public items:Array<any> =
    [
      {
        id:1,
        text:'Amsterdam'
      },
      {
        id:2,
        text:'Antwerp',
        disabled:true,
      },
      {
        id:3,
        text:'Athens',
        disabled:true,
      },
      {
        id:4,
        text:'Berlin',
        disabled:false,
      },
      {
        id:5,
        text:'Birmingham',
        disabled:false,
      },
      {
        id:6,
        text:'Bradford',
        disabled:true,
      },
      {
        id:7,
        text:'Bremen',
        disabled:false,
      },
      {
        id:8,
        text:'Bucharest',
        disabled:true,
      },
      {
        id:8,
        text:'Malaga',
        disabled:false,
      }
    ];

  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;
  private get disabledV():string {
    return this._disabledV;
  }

  private set disabledV(value:string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  public selected(value:any):void {
    console.log('Selected value is: ', value);
  }

  public removed(value:any):void {
    console.log('Removed value is: ', value);
  }

  public typed(value:any):void {
    console.log('New search input: ', value);
  }

  public refreshValue(value:any):void {
    this.value = value;
  }
}
