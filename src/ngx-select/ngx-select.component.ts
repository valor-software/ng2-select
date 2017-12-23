import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';
import { KeyboardEvent } from 'ngx-bootstrap/utils/facade/browser';

@Component({
  selector: 'ngx-select',
  templateUrl: './ngx-select.component.html',
  styleUrls: ['./ngx-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NgxSelectComponent),
      multi: true
    }
  ]
})
export class NgxSelectComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() public items: any[];
  @Input() public idField: string = 'id';
  @Input() public textField: string = 'text';
  @Input() public childrenField: string = 'children';
  @Input() public multiple: boolean = false;
  @Input() public allowClear: boolean = false;
  @Input() public placeholder: string = '';
  @Input() public noAutoComplete: boolean = false;
  @Input() public disabled: boolean = false;
  @Input() public active: any | any[];

  constructor() {
  }

  ngOnInit() {
  }

  public clickedOutside(): void {
  }

  public mainClick(event: KeyboardEvent): void {
  }

  public focusToInput(): void {
  }

  public matchClick(e: any): void {
  }

  //////////// interface Validator ////////////
  validate(c: AbstractControl): { [key: string]: any; } {
    return null;
  }

  //////////// interface ControlValueAccessor ////////////
  public propagateChange = (_: any) => _;

  public onTouchedCallback: () => void = () => null;

  writeValue(obj: any): void {
  }

  public registerOnChange(fn: (_: any) => {}): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(fn: () => {}): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }
}
