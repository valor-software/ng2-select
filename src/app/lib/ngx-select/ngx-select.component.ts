import {
    AfterContentChecked, DoCheck, Input, Output, ViewChild,
    Component, ElementRef, EventEmitter, forwardRef, HostListener, IterableDiffer, IterableDiffers
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
// import { KeyboardEvent } from 'ngx-bootstrap/utils/facade/browser';
import {NgxSelectOptGroup, NgxSelectOption, TSelectOption} from './ngx-select.classes';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import * as _ from 'lodash';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import {Subject} from 'rxjs/Subject';

export interface INgxSelectComponentMouseEvent extends MouseEvent {
    clickedSelectComponent?: NgxSelectComponent;
}

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
export class NgxSelectComponent implements ControlValueAccessor, DoCheck, AfterContentChecked {
    @Input() public items: any[];
    @Input() public optionValueField = 'id';
    @Input() public optionTextField = 'text';
    @Input() public optGroupLabelField = 'label';
    @Input() public optGroupOptionsField = 'options';
    @Input() public multiple = false;
    @Input() public allowClear = false;
    @Input() public placeholder = '';
    @Input() public noAutoComplete = false;
    @Input() public disabled = false;
    @Input() public defaultValue: any[] = [];

    @Output() public typed = new EventEmitter<string>();
    @Output() public focus = new EventEmitter<void>();
    @Output() public blur = new EventEmitter<void>();

    @ViewChild('main') protected mainElRef: ElementRef;
    @ViewChild('input') protected inputElRef: ElementRef;
    @ViewChild('choiceMenu') protected choiceMenuElRef: ElementRef;

    public optionsOpened = false;
    public optionsFiltered: TSelectOption[];

    private optionActive: NgxSelectOption;
    private itemsDiffer: IterableDiffer<any>;
    private defaultValueDiffer: IterableDiffer<any[]>;
    private actualValue: any[] = [];

    private subjOptions = new BehaviorSubject<TSelectOption[]>([]);
    private subjSearchText = new BehaviorSubject<string>('');

    private subjOptionsSelected = new BehaviorSubject<NgxSelectOption[]>([]);
    private subjExternalValue = new BehaviorSubject<any[]>([]);
    private subjDefaultValue = new BehaviorSubject<any[]>([]);
    private subjRegisterOnChange = new Subject();

    private cacheOptionsFilteredFlat: NgxSelectOption[];
    private cacheElementOffsetTop: number;

    private _focusToInput = false;
    private isFocused = false;

    constructor(private sanitizer: DomSanitizer, iterableDiffers: IterableDiffers) {
        // differs
        this.itemsDiffer = iterableDiffers.find([]).create<any>(null);
        this.defaultValueDiffer = iterableDiffers.find([]).create<any>(null);

        // observers
        this.typed.subscribe((text: string) => this.subjSearchText.next(text));
        let cacheExternalValue: any[];
        const subjActualValue = this.subjExternalValue
            .map((v: any[]) => cacheExternalValue = v === null ? [] : [].concat(v))
            .merge(this.subjOptionsSelected.map((options: NgxSelectOption[]) =>
                options.map((o: NgxSelectOption) => o.value)
            ))
            .combineLatest(this.subjDefaultValue, (eVal: any[], dVal: any[]) => {
                const newVal = _.isEqual(eVal, dVal) ? [] : eVal;
                return newVal.length ? newVal : dVal;
            })
            .distinctUntilChanged((x, y) => _.isEqual(x, y))
            .share();

        subjActualValue
            .combineLatest(this.subjRegisterOnChange, (actualValue: any[]) => actualValue)
            .subscribe((actualValue: any[]) => {
                this.actualValue = actualValue;
                if (!_.isEqual(actualValue, cacheExternalValue)) {
                    cacheExternalValue = actualValue;
                    if (this.multiple) {
                        this.onChange(actualValue);
                    } else {
                        this.onChange(actualValue.length ? actualValue[0] : null);
                    }
                }
            });

        this.subjOptions
            .flatMap((options: TSelectOption[]) => Observable
                .from(options)
                .flatMap((option: TSelectOption) => option instanceof NgxSelectOption
                    ? Observable.of(option)
                    : (option instanceof NgxSelectOptGroup ? Observable.from(option.options) : Observable.empty())
                )
                .toArray()
            )
            .combineLatest(subjActualValue, (optionsFlat: NgxSelectOption[], actualValue: any[]) => {
                Observable.from(optionsFlat)
                    .filter((option: NgxSelectOption) => actualValue.indexOf(option.value) !== -1)
                    .toArray()
                    .filter((options: NgxSelectOption[]) => !_.isEqual(options, this.subjOptionsSelected.value))
                    .subscribe((options: NgxSelectOption[]) => this.subjOptionsSelected.next(options));
            })
            .subscribe();

        this.subjOptions
            .combineLatest(this.subjOptionsSelected, this.subjSearchText,
                (options: TSelectOption[], selectedOptions: NgxSelectOption[], search: string) => {
                    return this.filterOptions(search, options, selectedOptions);
                }
            )
            .subscribe((filteredOptions: TSelectOption[]) => {
                this.optionsFiltered = filteredOptions;
                this.cacheOptionsFilteredFlat = null;
            });
    }

    public get optionsSelected(): NgxSelectOption[] {
        return this.subjOptionsSelected.value;
    }

    public mainClicked(event: INgxSelectComponentMouseEvent) {
        event.clickedSelectComponent = this;
        if (!this.isFocused) {
            this.isFocused = true;
            this.focus.emit();
        }
    }

    @HostListener('document:focusin', ['$event'])
    @HostListener('document:click', ['$event'])
    public documentClick(event: INgxSelectComponentMouseEvent) {
        if (event.clickedSelectComponent !== this) {
            if (this.optionsOpened) {
                this.optionsClose();
            }
            if (this.isFocused) {
                this.isFocused = false;
                this.blur.emit();
            }
        }
    }

    private navigateOption(navigation: ENavigation) {
        (this.cacheOptionsFilteredFlat
                ? Observable.of(this.cacheOptionsFilteredFlat)
                : Observable.from(this.optionsFiltered)
                    .flatMap<TSelectOption, NgxSelectOption>((option: TSelectOption) =>
                        option instanceof NgxSelectOption ? Observable.of(option) :
                            (option instanceof NgxSelectOptGroup ? Observable.from(option.optionsFiltered) : Observable.empty())
                    )
                    .toArray()
                    .do((optionsFilteredFlat: NgxSelectOption[]) => this.cacheOptionsFilteredFlat = optionsFilteredFlat)
        )
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

    public ngAfterContentChecked(): void {
        if (this._focusToInput && this.checkInputVisibility() && this.inputElRef &&
            this.inputElRef.nativeElement !== document.activeElement) {
            this._focusToInput = false;
            this.inputElRef.nativeElement.focus();
        }
    }

    public canClearNotMultiple(): boolean {
        return this.allowClear && !!this.subjOptionsSelected.value.length &&
            (!this.subjDefaultValue.value.length || this.subjDefaultValue.value[0] !== this.actualValue[0]);
    }

    public focusToInput(): void {
        this._focusToInput = true;
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
        } else if (this.optionsOpened && [37, 38, 39, 40].indexOf(event.keyCode) !== -1) {
            event.preventDefault();
            event.stopPropagation();
            switch (event.keyCode) {
                case 37: // key arrow_left
                    this.navigateOption(ENavigation.first);
                    break;
                case 38: // key arrow_up
                    this.navigateOption(ENavigation.previous);
                    break;
                case 39: // key arrow_right
                    this.navigateOption(ENavigation.last);
                    break;
                case 40: // key arrow_down
                    this.navigateOption(ENavigation.next);
                    break;
            }
        } else if (!this.optionsOpened && event.keyCode === 46 /*key delete*/) {
            this.optionRemove(this.subjOptionsSelected.value[this.subjOptionsSelected.value.length - 1], event);
        }
    }

    public mainKeyUp(event: KeyboardEvent): void {
        if (event.keyCode === 27 /* key escape */) {
            this.optionsClose(true);
        }
    }

    public trackByOption(index: number, option: TSelectOption) {
        return option instanceof NgxSelectOption ? option.value :
            (option instanceof NgxSelectOptGroup ? option.label : option);
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

    protected sanitize(html: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    protected highlightOption(option: NgxSelectOption): SafeHtml {
        if (this.inputElRef) {
            return option.renderText(this.sanitizer, this.inputElRef.nativeElement.value);
        }
        return option.renderText(this.sanitizer, '');
    }

    protected optionSelect(option: NgxSelectOption, event: Event = null): void {
        if (event) {
            event.stopPropagation();
        }
        this.subjOptionsSelected.next((this.multiple ? this.subjOptionsSelected.value : []).concat([option]));
        this.optionsClose(true);
        this.onTouched();
    }

    protected optionRemove(option: NgxSelectOption, event: Event): void {
        if (!this.disabled) {
            event.stopPropagation();
            this.subjOptionsSelected.next((this.multiple ? this.subjOptionsSelected.value : []).filter(o => o !== option));
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

    private filterOptions(search: string, options: TSelectOption[], selectedOptions: NgxSelectOption[]): TSelectOption[] {
        const regExp = new RegExp(search, 'i'),
            filterOption = (option: NgxSelectOption) => {
                return (!search || regExp.test(option.text)) && (!this.multiple || selectedOptions.indexOf(option) === -1);
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
            if (!this.multiple && this.subjOptionsSelected.value.length) {
                this.optionActivate(this.subjOptionsSelected.value[0]);
            } else {
                this.navigateOption(ENavigation.first);
            }
            this.focusToInput();
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

    //////////// interface ControlValueAccessor ////////////
    public onChange = (v: any) => v;

    public onTouched: () => void = () => null;

    public writeValue(obj: any): void {
        this.subjExternalValue.next(obj);
    }

    public registerOnChange(fn: (_: any) => {}): void {
        this.onChange = fn;
        this.subjRegisterOnChange.next();
    }

    public registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
