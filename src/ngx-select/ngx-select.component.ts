import { Component, DoCheck, ElementRef, forwardRef, Input, IterableDiffer, IterableDiffers, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { KeyboardEvent } from 'ngx-bootstrap/utils/facade/browser';
import { NgxSelectOptGroup, NgxSelectOption } from './ngx-select.classes';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/last';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/toArray';

@Component({
  selector: 'ngx-select',
  templateUrl: './ngx-select.component.html',
  styleUrls: ['./ngx-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxSelectComponent),
      multi: true
    }
  ]
})
export class NgxSelectComponent implements ControlValueAccessor, DoCheck {
  @Input() public items: any[];
  @Input() public optionValueField: string = 'id';
  @Input() public optionTextField: string = 'text';
  @Input() public optGroupLabelField: string = 'label';
  @Input() public optGroupOptionsField: string = 'options';
  @Input() public multiple: boolean = false;
  @Input() public allowClear: boolean = false;
  @Input() public placeholder: string = '';
  @Input() public noAutoComplete: boolean = false;
  @Input() public disabled: boolean = false;
  @Input() public defaultValue: any[] = [];

  @ViewChild('main') protected mainElRef: ElementRef;
  @ViewChild('input') protected inputElRef: ElementRef;
  @ViewChild('choiceMenu') protected choiceMenuElRef: ElementRef;

  public optionsOpened: boolean = false;
  public optionsFiltered: Array<NgxSelectOptGroup | NgxSelectOption> = [];
  protected options: Array<NgxSelectOptGroup | NgxSelectOption> = [];
  protected optionsSelected: Array<NgxSelectOption> = [];
  protected optionActive: NgxSelectOption;
  private itemsDiffer: IterableDiffer<any>;
  private defaultValueDiffer: IterableDiffer<any[]>;
  private cacheFilterSearchText: string;
  private cacheSelectedLength: number;
  private cacheElementOffsetTop: number;
  private _value: any[] = [];
  private _defaultValue: any[] = [];

  constructor(private sanitizer: DomSanitizer, iterableDiffers: IterableDiffers) {
    this.itemsDiffer = iterableDiffers.find([]).create<any>(null);
    this.defaultValueDiffer = iterableDiffers.find([]).create<any>(null);
  }

  public ngDoCheck(): void {
    if (this.itemsDiffer.diff(this.items)) {
      this.options = this.buildOptions(this.items);
      this.valueToOptionsSelected();
      this.optionsFilter('', true);
      this.propagateActualValues();
    }

    const defVal = this.defaultValue ? [].concat(this.defaultValue) : [];
    if (this.defaultValueDiffer.diff(defVal)) {
      this._defaultValue = defVal;
      if (/*!this._value.length &&*/ this._defaultValue.length) {
        this.valueToOptionsSelected();
        this.valueFromOptionsSelected();
      }
    }
  }

  private propagateActualValues() {
    this.observableOptions()
      .map((option: NgxSelectOption) => option.value)
      .toArray()
      .subscribe((values: any[]) => {
        const newValues = this.value.filter(v => values.includes(v));
        if (!_.isEqual(this.value, newValues)) {
          this.onChange(newValues);
        }
      });
  }

  public canClearNotMultiple(): boolean {
    return this.allowClear && !!this.optionsSelected.length &&
      (!this._defaultValue.length || this._defaultValue[0] !== this.value[0]);
  }

  public focusToInput(): void {
    if (this.checkInputVisibility() && this.inputElRef &&
      this.inputElRef.nativeElement !== document.activeElement) {
      this.inputElRef.nativeElement.focus();
    }
  }

  public inputKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 13 /*key enter*/) {
      event.preventDefault();
      event.stopPropagation();
      if (this.optionsOpened) {
        this.optionSelect(this.optionActive);
        this.optionActivateNext();
      } else {
        this.optionsOpen();
      }
    } else if (this.optionsOpened && [37, 38, 39, 40].includes(event.keyCode)) {
      event.preventDefault();
      event.stopPropagation();
      switch (event.keyCode) {
        case 37: // arrow left
          this.optionActivateFirst();
          break;
        case 38: // arrow up
          this.optionActivatePrevious();
          break;
        case 39: // arrow right
          this.optionActivateLast();
          break;
        case 40: // arrow down
          this.optionActivateNext();
          break;
      }
    } else if (!this.optionsOpened && event.keyCode === 46 /*key delete*/) {
      this.optionRemove(this.optionsSelected[this.optionsSelected.length - 1], event);
    }
  }

  public hostKeyUp(event: KeyboardEvent): void {
    switch (event.keyCode) {
      case 27: // escape
        this.optionsClose(true);
        break;
    }
  }

  public trackByOption(index: number, option: NgxSelectOptGroup | NgxSelectOption) {
    return option instanceof NgxSelectOption ? option.value :
      (option instanceof NgxSelectOptGroup ? option.label : option);
  }

  public mainClickedOutside(): void {
    this.optionsClose();
  }

  public checkInputVisibility(): boolean {
    return (this.multiple === true) || (this.optionsOpened && !this.noAutoComplete);
  }

  protected inputKeyUp(value: string = '') {
    if (this.optionsOpened) {
      this.optionsFilter(value);
    } else if (value) {
      this.optionsOpen(value);
    }
  }

  protected inputClick(value: string = '') {
    if (!this.optionsOpened) {
      this.optionsOpen(value);
    }
  }

  protected optionsFilter(search: string, optionsChanged: boolean = false): void {
    if (optionsChanged || (this.cacheFilterSearchText !== search) ||
      (this.cacheSelectedLength !== this.optionsSelected.length)) {
      this.cacheFilterSearchText = search;
      this.cacheSelectedLength = this.optionsSelected.length;
      let activeIsFiltered = false;
      const regExp = new RegExp(this.cacheFilterSearchText, 'gi'),
        filterOption = (option: NgxSelectOption) => {
          const filter = regExp.test(option.text) && (!this.multiple || !this.optionsSelected.includes(option));
          if (!filter && option === this.optionActive) {
            activeIsFiltered = true;
          }
          return filter;
        };

      this.optionsFiltered = this.options.filter((option: NgxSelectOptGroup | NgxSelectOption) => {
        if (option instanceof NgxSelectOption) {
          return filterOption(<NgxSelectOption>option);
        } else if (option instanceof NgxSelectOptGroup) {
          const subOp = <NgxSelectOptGroup>option;
          subOp.filter((subOption: NgxSelectOption) => filterOption(subOption));
          return subOp.optionsFiltered.length;
        }
      });

      if (activeIsFiltered) {
        this.optionActivateFirst();
      }
    }
  }

  protected sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  protected highlightOption(option: NgxSelectOption): SafeHtml {
    if (this.inputElRef) {
      return option.renderText(this.sanitizer, this.inputElRef.nativeElement.value);
    }
    return option.renderText(this.sanitizer, '');
  }

  protected inputIsDisabled(): boolean {
    if (!this.disabled && this.optionsOpened) {
      this.focusToInput();
    }
    return this.disabled;
  }

  protected optionSelect(option: NgxSelectOption, event: Event = null): void {
    if (event) {
      event.stopPropagation();
    }
    if (!this.multiple) {
      this.optionsSelected.length = 0;
    }
    this.optionsSelected.push(option);
    this.optionsClose(true);
    this.valueFromOptionsSelected();
  }

  protected optionRemove(option: NgxSelectOption, event: Event): void {
    if (!this.disabled) {
      event.stopPropagation();
      if (this.multiple) {
        const optionIndex = this.optionsSelected.indexOf(option);
        this.optionsSelected.splice(optionIndex, 1);
      } else {
        this.optionsSelected.length = 0;
      }
      this.valueFromOptionsSelected();
    }
  }

  protected isOptionActive(option: NgxSelectOption, element: HTMLElement) {
    if (this.optionActive === option) {
      this.ensureVisibleElement(element);
      return true;
    }
    return false;
  }

  protected optionActivate(option: NgxSelectOption): void {
    this.optionActive = option;
  }

  private get value(): any[] {
    return this._value.length ? this._value : this._defaultValue;
  }

  private setValue(val: any[], isExternalValue: boolean = false) {
    const newVal = val ? [].concat(val) : [];
    this._value = _.isEqual(newVal, this._defaultValue) ? [] : newVal;
    this.valueToOptionsSelected();
    if (!isExternalValue || !_.isEqual(val, this.value)) {
      this.onChange(this.value);
      this.onTouched();
    }
  }

  private optionActivateFirst(): void {
    this.observableOptions(true).take(1)
      .subscribe((option: NgxSelectOption) => this.optionActivate(option));
  }

  private optionActivateNext(): void {
    this.observableOptions(true).toArray()
      .subscribe((options: NgxSelectOption[]) => {
        const newActiveIdx = options.indexOf(this.optionActive) + 1;
        if (newActiveIdx < options.length) {
          this.optionActivate(options[newActiveIdx]);
        } else {
          this.optionActivate(options[0]);
        }
      });
  }

  private optionActivatePrevious(): void {
    this.observableOptions(true).toArray()
      .subscribe((options: NgxSelectOption[]) => {
        const newActiveIdx = options.indexOf(this.optionActive) - 1;
        if (newActiveIdx >= 0) {
          this.optionActivate(options[newActiveIdx]);
        } else {
          this.optionActivate(options[options.length - 1]);
        }
      });
  }

  private optionActivateLast(): void {
    this.observableOptions(true).last()
      .subscribe((option: NgxSelectOption) => this.optionActivate(option));
  }

  private ensureVisibleElement(element: HTMLElement) {
    if (this.choiceMenuElRef && this.cacheElementOffsetTop !== element.offsetTop) {
      this.cacheElementOffsetTop = element.offsetTop;
      const container: HTMLElement = this.choiceMenuElRef.nativeElement;
      if (this.cacheElementOffsetTop < container.scrollTop) {
        container.scrollTop = this.cacheElementOffsetTop;
      } else if (this.cacheElementOffsetTop + element.offsetHeight > container.scrollTop + container.clientHeight) {
        container.scrollTop = this.cacheElementOffsetTop + element.offsetHeight - container.clientHeight;
      }
    }
  }

  private optionsOpen(search: string = '') {
    if (!this.disabled) {
      this.optionsOpened = true;
      this.optionsFilter(search);
      if (!this.multiple && this.optionsSelected.length) {
        this.optionActivate(this.optionsSelected[0]);
      } else {
        this.optionActivateFirst();
      }
    }
  }

  private optionsClose(focusToHost: boolean = false) {
    this.optionsOpened = false;
    if (focusToHost) {
      const x = window.scrollX, y = window.scrollY;
      this.mainElRef.nativeElement.focus();
      window.scrollTo(x, y);
    }
  }

  private buildOptions(data: any[]): Array<NgxSelectOption | NgxSelectOptGroup> {
    const result: Array<NgxSelectOption | NgxSelectOptGroup> = [];
    if (Array.isArray(data)) {
      let option: NgxSelectOption;
      data.forEach((item: any) => {
        const isOptGroup = typeof item === 'object' && item !== null &&
          item.hasOwnProperty(this.optGroupLabelField) && item.hasOwnProperty(this.optGroupOptionsField) &&
          Array.isArray(item[this.optGroupOptionsField]);
        if (isOptGroup) {
          const optGroup = new NgxSelectOptGroup(item[this.optGroupLabelField]);
          item[this.optGroupOptionsField].forEach((subOption: NgxSelectOption) => {
            if (option = this.buildOption(subOption, optGroup)) {
              optGroup.options.push(option);
            }
          });
          result.push(optGroup);
        } else if (option = this.buildOption(item, null)) {
          result.push(option);
        }
      });
    }
    return result;
  }

  private buildOption(data: any, parent: NgxSelectOptGroup): NgxSelectOption {
    let value, text;
    if (typeof data === 'string' || typeof data === 'number') {
      value = text = data;
    } else if (typeof data === 'object' && data !== null &&
      (data.hasOwnProperty(this.optionValueField) || data.hasOwnProperty(this.optionTextField))) {
      value = data.hasOwnProperty(this.optionValueField) ? data[this.optionValueField] : data[this.optionTextField];
      text = data.hasOwnProperty(this.optionTextField) ? data[this.optionTextField] : data[this.optionValueField];
    } else {
      return null;
    }
    return new NgxSelectOption(value, text, parent);
  }

  private valueToOptionsSelected(): void {
    this.optionsSelected.length = 0;
    this.observableOptions()
      .filter((option: NgxSelectOption) => this.value.includes(option.value))
      .subscribe((option: NgxSelectOption) => this.optionsSelected.push(option));
  }

  private valueFromOptionsSelected(): void {
    this.setValue(this.optionsSelected.map((option: NgxSelectOption) => option.value));
  }

  private observableOptions(filtered: boolean = false): Observable<NgxSelectOption> {
    if (filtered) {
      return Observable.from(this.optionsFiltered)
        .flatMap((option: NgxSelectOptGroup | NgxSelectOption) =>
          option instanceof NgxSelectOption ? Observable.of(option) :
            (option instanceof NgxSelectOptGroup ? Observable.from(option.optionsFiltered) : Observable.empty())
        );
    }
    return Observable.from(this.options)
      .flatMap((option: NgxSelectOptGroup | NgxSelectOption) =>
        option instanceof NgxSelectOption ? Observable.of(option) :
          (option instanceof NgxSelectOptGroup ? Observable.from(option.options) : Observable.empty())
      );
  }

  //////////// interface ControlValueAccessor ////////////
  public onChange = (_: any) => _;

  public onTouched: () => void = () => null;

  public writeValue(obj: any): void {
    this.setValue(obj, true);
  }

  public registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
