import {
  Component, DoCheck, ElementRef, EventEmitter, forwardRef, Input, IterableDiffer, IterableDiffers, Output, ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { KeyboardEvent } from 'ngx-bootstrap/utils/facade/browser';
import { NgxSelectOptGroup, NgxSelectOption, TSelectOption } from './ngx-select.classes';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

enum ENavigation {
  first, previous, next, last
}

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

  @Output() public typed = new EventEmitter<string>();

  @ViewChild('main') protected mainElRef: ElementRef;
  @ViewChild('input') protected inputElRef: ElementRef;
  @ViewChild('choiceMenu') protected choiceMenuElRef: ElementRef;

  public optionsOpened: boolean = false;
  public optionsFiltered: Array<TSelectOption> = [];
  protected optionsSelected: Array<NgxSelectOption> = [];
  protected optionActive: NgxSelectOption;
  private itemsDiffer: IterableDiffer<any>;
  private defaultValueDiffer: IterableDiffer<any[]>;
  private cacheElementOffsetTop: number;
  private _value: any[] = [];
  private _defaultValue: any[] = [];

  public subjOptionsFiltered: Observable<TSelectOption[]>;
  private subjOptions = new BehaviorSubject<TSelectOption[]>([]);
  private subjSearchText = new BehaviorSubject<string>('');
  private subjSelectedOptions = new BehaviorSubject<NgxSelectOption[]>([]);
  private subjDefaultValue = new BehaviorSubject<any[]>([]);

  private cacheOptions: Array<TSelectOption> = [];
  private cacheOptionsFiltered: TSelectOption[];
  private cacheOptionsFilteredFlat: NgxSelectOption[];

  constructor(private sanitizer: DomSanitizer, iterableDiffers: IterableDiffers) {
    // differs
    this.itemsDiffer = iterableDiffers.find([]).create<any>(null);
    this.defaultValueDiffer = iterableDiffers.find([]).create<any>(null);

    // observers
    this.subjSelectedOptions.subscribe(() => this.valueFromOptionsSelected());
    this.typed.subscribe((text: string) => this.subjSearchText.next(text));

    this.subjOptions.subscribe((options: TSelectOption[]) => {
      this.cacheOptions = options;
      this.valueToOptionsSelected();
      this.propagateActualValues();
    });

    this.subjDefaultValue.subscribe((defVal: any[]) => {
      this._defaultValue = defVal;
      if (defVal.length) {
        this.valueToOptionsSelected();
        this.valueFromOptionsSelected();
      }
    });

    this.subjOptionsFiltered = this.subjSearchText
      .combineLatest(this.subjOptions, this.subjSelectedOptions,
        (search: string, options: TSelectOption[], selectedOptions: NgxSelectOption[]) => {
          return {search: search, options: options, selectedOptions: selectedOptions};
        }
      )
      .map((data: { search: string; options: TSelectOption[]; selectedOptions: NgxSelectOption[] }) =>
        this.filterOptions(data.search, data.options, data.selectedOptions)
      )
      .do((filteredOptions: TSelectOption[]) => {
        this.cacheOptionsFiltered = filteredOptions;
        this.cacheOptionsFilteredFlat = null;
      });
  }

  private navigateOption(navigation: ENavigation) {
    this.obsOptionsFilteredFlat()
      .map((options: NgxSelectOption[]) => {
        let newActiveIdx;
        switch (navigation) {
          case ENavigation.first:
            return options[0];
          case ENavigation.previous:
            newActiveIdx = options.indexOf(this.optionActive) - 1;
            if (newActiveIdx >= 0) {
              return options[newActiveIdx];
            }
            return options[options.length - 1];
          case ENavigation.next:
            newActiveIdx = options.indexOf(this.optionActive) + 1;
            if (newActiveIdx < options.length) {
              return options[newActiveIdx];
            }
            return options[0];
          case ENavigation.last:
            return options[options.length - 1];
        }
      })
      .subscribe((newActiveOption: NgxSelectOption) => this.optionActive = newActiveOption);
  }

  public ngDoCheck(): void {
    if (this.itemsDiffer.diff(this.items)) {
      this.subjOptions.next(this.buildOptions(this.items));
    }

    const defVal = this.defaultValue ? [].concat(this.defaultValue) : [];
    if (this.defaultValueDiffer.diff(defVal)) {
      this.subjDefaultValue.next(defVal);
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
        this.navigateOption(ENavigation.next);
      } else {
        this.optionsOpen();
      }
    } else if (this.optionsOpened && [37, 38, 39, 40].includes(event.keyCode)) {
      event.preventDefault();
      event.stopPropagation();
      switch (event.keyCode) {
        case 37: // arrow left
          this.navigateOption(ENavigation.first);
          break;
        case 38: // arrow up
          this.navigateOption(ENavigation.previous);
          break;
        case 39: // arrow right
          this.navigateOption(ENavigation.last);
          break;
        case 40: // arrow down
          this.navigateOption(ENavigation.next);
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

  public trackByOption(index: number, option: TSelectOption) {
    return option instanceof NgxSelectOption ? option.value :
      (option instanceof NgxSelectOptGroup ? option.label : option);
  }

  public mainClickedOutside(): void {
    this.optionsClose();
  }

  public checkInputVisibility(): boolean {
    return (this.multiple === true) || (this.optionsOpened && !this.noAutoComplete);
  }

  protected inputKeyUp(event: KeyboardEvent, value: string = '') {
    if (this.optionsOpened) {
      if (event.key && (event.key.length === 1 || event.key === 'Backspace')) {
        this.typed.emit(value);
      }
    } else if (value) {
      this.optionsOpen(value);
    }
  }

  protected inputClick(value: string = '') {
    if (!this.optionsOpened) {
      this.optionsOpen(value);
    }
  }

  private filterOptions(search: string, options: TSelectOption[], selectedOptions: NgxSelectOption[]): TSelectOption[] {
    const multiple = this.multiple,
      regExp = new RegExp(search, 'gi'),
      filterOption = (option: NgxSelectOption) => {
        return regExp.test(option.text) && (!multiple || !selectedOptions.includes(option));
      };

    return options.filter((option: TSelectOption) => {
      if (option instanceof NgxSelectOption) {
        return filterOption(<NgxSelectOption>option);
      } else if (option instanceof NgxSelectOptGroup) {
        const subOp = <NgxSelectOptGroup>option;
        subOp.filter((subOption: NgxSelectOption) => filterOption(subOption));
        return subOp.optionsFiltered.length;
      }
    });
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

    this.subjSelectedOptions.next(this.optionsSelected);

    this.optionsClose(true);
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
      this.subjSelectedOptions.next(this.optionsSelected);
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
      this.subjSearchText.next(search);
      if (!this.multiple && this.optionsSelected.length) {
        this.optionActivate(this.optionsSelected[0]);
      } else {
        this.navigateOption(ENavigation.first);
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

  private obsOptionsFilteredFlat(): Observable<NgxSelectOption[]> {
    if (this.cacheOptionsFilteredFlat) {
      return Observable.of(this.cacheOptionsFilteredFlat);
    }
    return Observable.from(this.cacheOptionsFiltered)
      .flatMap<TSelectOption, NgxSelectOption>((option: TSelectOption) =>
        option instanceof NgxSelectOption ? Observable.of(option) :
          (option instanceof NgxSelectOptGroup ? Observable.from(option.optionsFiltered) : Observable.empty())
      )
      .toArray()
      .do((optionsFilteredFlat: NgxSelectOption[]) => this.cacheOptionsFilteredFlat = optionsFilteredFlat);
  }

  /**
   * @deprecated
   * @returns {Observable<NgxSelectOption>}
   */
  private observableOptions(): Observable<NgxSelectOption> {
    return Observable.from(this.cacheOptions)
      .flatMap((option: TSelectOption) =>
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
