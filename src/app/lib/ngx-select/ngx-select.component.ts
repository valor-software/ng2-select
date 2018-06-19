import {
    AfterContentChecked, DoCheck, Input, Output, ViewChild,
    Component, ElementRef, EventEmitter, forwardRef, HostListener, IterableDiffer, IterableDiffers, ChangeDetectorRef, ContentChild,
    TemplateRef, Optional, Inject, InjectionToken
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Subject} from 'rxjs/Subject';
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
import * as lodashNs from 'lodash';
import * as escapeStringNs from 'escape-string-regexp';
import {NgxSelectOptGroup, NgxSelectOption, TSelectOption} from './ngx-select.classes';
import {NgxSelectOptionDirective, NgxSelectOptionNotFoundDirective, NgxSelectOptionSelectedDirective} from './ngx-templates.directive';
import {INgxOptionNavigated, INgxSelectOption, INgxSelectOptions} from './ngx-select.interfaces';

const _ = lodashNs;
const escapeString = escapeStringNs;

export const NGX_SELECT_OPTIONS = new InjectionToken<any>('NGX_SELECT_OPTIONS');

export interface INgxSelectComponentMouseEvent extends MouseEvent {
    clickedSelectComponent?: NgxSelectComponent;
}

enum ENavigation {
    first, previous, next, last,
    firstSelected, firstIfOptionActiveInvisible
}

function propertyExists(obj: Object, propertyName: string) {
    return propertyName in obj;
}

@Component({
    selector: 'ngx-select',
    templateUrl: './ngx-select.component.html',
    styleUrls: ['./ngx-select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NgxSelectComponent),
            multi: true
        }
    ]
})
export class NgxSelectComponent implements INgxSelectOptions, ControlValueAccessor, DoCheck, AfterContentChecked {
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
    @Input() public autoSelectSingleOption = false;
    @Input() public autoClearSearch = false;
    @Input() public noResultsFound = 'No results found';
    @Input() public keepSelectedItems: false;
    @Input() public size: 'small' | 'default' | 'large' = 'default';
    @Input() public searchCallback: (search: string, item: INgxSelectOption) => boolean;
    public keyCodeToRemoveSelected = 'Delete';
    public keyCodeToOptionsOpen = ['Enter', 'NumpadEnter'];
    public keyCodeToOptionsClose = 'Escape';
    public keyCodeToOptionsSelect = ['Enter', 'NumpadEnter'];
    public keyCodeToNavigateFirst = 'ArrowLeft';
    public keyCodeToNavigatePrevious = 'ArrowUp';
    public keyCodeToNavigateNext = 'ArrowDown';
    public keyCodeToNavigateLast = 'ArrowRight';

    @Output() public typed = new EventEmitter<string>();
    @Output() public focus = new EventEmitter<void>();
    @Output() public blur = new EventEmitter<void>();
    @Output() public open = new EventEmitter<void>();
    @Output() public close = new EventEmitter<void>();
    @Output() public select = new EventEmitter<any>();
    @Output() public remove = new EventEmitter<any>();
    @Output() public navigated = new EventEmitter<INgxOptionNavigated>();
    @Output() public selectionChanges = new EventEmitter<INgxSelectOption[]>();

    @ViewChild('main') protected mainElRef: ElementRef;
    @ViewChild('input') protected inputElRef: ElementRef;
    @ViewChild('choiceMenu') protected choiceMenuElRef: ElementRef;

    @ContentChild(NgxSelectOptionDirective, {read: TemplateRef}) templateOption: NgxSelectOptionDirective;
    @ContentChild(NgxSelectOptionSelectedDirective, {read: TemplateRef}) templateSelectedOption: NgxSelectOptionSelectedDirective;
    @ContentChild(NgxSelectOptionNotFoundDirective, {read: TemplateRef}) templateOptionNotFound: NgxSelectOptionNotFoundDirective;

    public optionsOpened = false;
    public optionsFiltered: TSelectOption[];

    private optionActive: NgxSelectOption;
    private itemsDiffer: IterableDiffer<any>;
    private defaultValueDiffer: IterableDiffer<any[]>;
    private actualValue: any[] = [];

    public subjOptions = new BehaviorSubject<TSelectOption[]>([]);
    private subjSearchText = new BehaviorSubject<string>('');

    private subjOptionsSelected = new BehaviorSubject<NgxSelectOption[]>([]);
    private subjExternalValue = new BehaviorSubject<any[]>([]);
    private subjDefaultValue = new BehaviorSubject<any[]>([]);
    private subjRegisterOnChange = new Subject();

    private cacheOptionsFilteredFlat: NgxSelectOption[];
    private cacheElementOffsetTop: number;

    private _focusToInput = false;
    public isFocused = false;

    constructor(iterableDiffers: IterableDiffers, private sanitizer: DomSanitizer, private cd: ChangeDetectorRef,
                @Inject(NGX_SELECT_OPTIONS) @Optional() defaultOptions: INgxSelectOptions) {
        Object.assign(this, defaultOptions);

        // DIFFERS
        this.itemsDiffer = iterableDiffers.find([]).create<any>(null);
        this.defaultValueDiffer = iterableDiffers.find([]).create<any>(null);

        // OBSERVERS
        this.typed.subscribe((text: string) => this.subjSearchText.next(text));
        this.subjOptionsSelected.subscribe((options: NgxSelectOption[]) => this.selectionChanges.emit(options));
        let cacheExternalValue: any[];

        // Get actual value
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

        // Export actual value
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

        // Correct selected options when the options changed
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
                    .filter((options: NgxSelectOption[]) => {
                        if (this.keepSelectedItems) {
                            const optionValues = options.map((option: NgxSelectOption) => option.value);
                            const keptSelectedOptions = this.subjOptionsSelected.value
                                .filter((selOption: NgxSelectOption) => optionValues.indexOf(selOption.value) === -1);
                            options = keptSelectedOptions.concat(options);
                        }
                        return !_.isEqual(options, this.subjOptionsSelected.value);
                    })
                    .subscribe((options: NgxSelectOption[]) => this.subjOptionsSelected.next(options));
            })
            .subscribe();

        // Ensure working filter by a search text
        this.subjOptions
            .combineLatest(this.subjOptionsSelected, this.subjSearchText,
                (options: TSelectOption[], selectedOptions: NgxSelectOption[], search: string) => {
                    this.optionsFiltered = this.filterOptions(search, options, selectedOptions);
                    this.cacheOptionsFilteredFlat = null;
                    this.navigateOption(ENavigation.firstIfOptionActiveInvisible);
                    return selectedOptions;
                }
            )
            .flatMap((selectedOptions: NgxSelectOption[]) => {
                return this.optionsFilteredFlat().filter((flatOptions: NgxSelectOption[]) =>
                    this.autoSelectSingleOption && flatOptions.length === 1 && !selectedOptions.length
                );
            })
            .subscribe((flatOptions: NgxSelectOption[]) => this.subjOptionsSelected.next(flatOptions));
    }

    public setFormControlSize(otherClassNames: Object = {}, useFormControl: boolean = true) {
        const formControlExtraClasses = useFormControl ? {
            'form-control-sm input-sm': this.size === 'small',
            'form-control-lg input-lg': this.size === 'large'
        } : {};
        return Object.assign(formControlExtraClasses, otherClassNames);
    }

    public setBtnSize() {
        return {'btn-sm': this.size === 'small', 'btn-lg': this.size === 'large'};
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
                this.cd.detectChanges(); // fix error because of delay between different events
            }
            if (this.isFocused) {
                this.isFocused = false;
                this.blur.emit();
            }
        }
    }

    private optionsFilteredFlat(): Observable<NgxSelectOption[]> {
        if (this.cacheOptionsFilteredFlat) {
            return Observable.of(this.cacheOptionsFilteredFlat);
        }

        return Observable.from(this.optionsFiltered)
            .flatMap<TSelectOption, NgxSelectOption>((option: TSelectOption) =>
                option instanceof NgxSelectOption ? Observable.of(option) :
                    (option instanceof NgxSelectOptGroup ? Observable.from(option.optionsFiltered) : Observable.empty())
            )
            .filter((optionsFilteredFlat: NgxSelectOption) => !optionsFilteredFlat.disabled)
            .toArray()
            .do((optionsFilteredFlat: NgxSelectOption[]) => this.cacheOptionsFilteredFlat = optionsFilteredFlat);
    }

    private navigateOption(navigation: ENavigation) {
        this.optionsFilteredFlat()
            .map<NgxSelectOption[], INgxOptionNavigated>((options: NgxSelectOption[]) => {
                const navigated: INgxOptionNavigated = {index: -1, activeOption: null, filteredOptionList: options};
                let newActiveIdx;
                switch (navigation) {
                    case ENavigation.first:
                        navigated.index = 0;
                        break;
                    case ENavigation.previous:
                        newActiveIdx = options.indexOf(this.optionActive) - 1;
                        navigated.index = newActiveIdx >= 0 ? newActiveIdx : options.length - 1;
                        break;
                    case ENavigation.next:
                        newActiveIdx = options.indexOf(this.optionActive) + 1;
                        navigated.index = newActiveIdx < options.length ? newActiveIdx : 0;
                        break;
                    case ENavigation.last:
                        navigated.index = options.length - 1;
                        break;
                    case ENavigation.firstSelected:
                        if (this.subjOptionsSelected.value.length) {
                            navigated.index = options.indexOf(this.subjOptionsSelected.value[0]);
                        }
                        break;
                    case ENavigation.firstIfOptionActiveInvisible:
                        const idxOfOptionActive = options.indexOf(this.optionActive);
                        navigated.index = idxOfOptionActive > 0 ? idxOfOptionActive : 0;
                        break;
                }
                navigated.activeOption = options[navigated.index];
                return navigated;
            })
            .subscribe((newNavigated: INgxOptionNavigated) => this.optionActivate(newNavigated));
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
        const keysForOpenedState = [].concat(
            this.keyCodeToOptionsSelect,
            this.keyCodeToNavigateFirst,
            this.keyCodeToNavigatePrevious,
            this.keyCodeToNavigateNext,
            this.keyCodeToNavigateLast
        );
        const keysForClosedState = [].concat(this.keyCodeToOptionsOpen, this.keyCodeToRemoveSelected);

        if (this.optionsOpened && keysForOpenedState.indexOf(event.code) !== -1) {
            event.preventDefault();
            event.stopPropagation();
            switch (event.code) {
                case ([].concat(this.keyCodeToOptionsSelect).indexOf(event.code) + 1) && event.code:
                    this.optionSelect(this.optionActive);
                    this.navigateOption(ENavigation.next);
                    break;
                case this.keyCodeToNavigateFirst:
                    this.navigateOption(ENavigation.first);
                    break;
                case this.keyCodeToNavigatePrevious:
                    this.navigateOption(ENavigation.previous);
                    break;
                case this.keyCodeToNavigateLast:
                    this.navigateOption(ENavigation.last);
                    break;
                case this.keyCodeToNavigateNext:
                    this.navigateOption(ENavigation.next);
                    break;
            }
        } else if (!this.optionsOpened && keysForClosedState.indexOf(event.code) !== -1) {
            event.preventDefault();
            event.stopPropagation();
            switch (event.code) {
                case ([].concat(this.keyCodeToOptionsOpen).indexOf(event.code) + 1) && event.code:
                    this.optionsOpen();
                    break;
                case this.keyCodeToRemoveSelected:
                    this.optionRemove(this.subjOptionsSelected.value[this.subjOptionsSelected.value.length - 1], event);
                    break;
            }
        }
    }

    public mainKeyUp(event: KeyboardEvent): void {
        if (event.code === this.keyCodeToOptionsClose) {
            this.optionsClose(/*true*/);
        }
    }

    public trackByOption(index: number, option: TSelectOption) {
        return option instanceof NgxSelectOption ? option.value :
            (option instanceof NgxSelectOptGroup ? option.label : option);
    }

    public checkInputVisibility(): boolean {
        return (this.multiple === true) || (this.optionsOpened && !this.noAutoComplete);
    }

    /** @internal */
    public inputKeyUp(value: string = '') {
        if (!this.optionsOpened && value) {
            this.optionsOpen(value);
        }
    }

    /** @internal */
    public doInputText(value: string) {
        if (this.optionsOpened) {
            this.typed.emit(value);
        }
    }

    /** @internal */
    public inputClick(value: string = '') {
        if (!this.optionsOpened) {
            this.optionsOpen(value);
        }
    }

    /** @internal */
    public sanitize(html: string): SafeHtml {
        return html ? this.sanitizer.bypassSecurityTrustHtml(html) : null;
    }

    /** @internal */
    public highlightOption(option: NgxSelectOption): SafeHtml {
        if (this.inputElRef) {
            return option.renderText(this.sanitizer, this.inputElRef.nativeElement.value);
        }
        return option.renderText(this.sanitizer, '');
    }

    /** @internal */
    public optionSelect(option: NgxSelectOption, event: Event = null): void {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (option && !option.disabled) {
            this.subjOptionsSelected.next((this.multiple ? this.subjOptionsSelected.value : []).concat([option]));
            this.select.emit(option.value);
            this.optionsClose(/*true*/);
            this.onTouched();
        }
    }

    /** @internal */
    public optionRemove(option: NgxSelectOption, event: Event): void {
        if (!this.disabled && option) {
            event.stopPropagation();
            this.subjOptionsSelected.next((this.multiple ? this.subjOptionsSelected.value : []).filter(o => o !== option));
            this.remove.emit(option.value);
        }
    }

    /** @internal */
    public isOptionActive(option: NgxSelectOption, element: HTMLElement) {
        if (this.optionActive === option) {
            this.ensureVisibleElement(element);
            return true;
        }
        return false;
    }

    /** @internal */
    public optionActivate(navigated: INgxOptionNavigated): void {
        if ((this.optionActive !== navigated.activeOption) &&
            (!navigated.activeOption || !navigated.activeOption.disabled)) {
            this.optionActive = navigated.activeOption;
            this.navigated.emit(navigated);
        }
    }

    private filterOptions(search: string, options: TSelectOption[], selectedOptions: NgxSelectOption[]): TSelectOption[] {
        const regExp = new RegExp(escapeString(search), 'i'),
            filterOption = (option: NgxSelectOption) => {
                if (this.searchCallback) {
                    return this.searchCallback(search, option);
                }
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

    public optionsOpen(search: string = '') {
        if (!this.disabled) {
            this.optionsOpened = true;
            this.subjSearchText.next(search);
            if (!this.multiple && this.subjOptionsSelected.value.length) {
                this.navigateOption(ENavigation.firstSelected);
            } else {
                this.navigateOption(ENavigation.first);
            }
            this.focusToInput();
            this.open.emit();
        }
    }

    public optionsClose(/*focusToHost: boolean = false*/) {
        this.optionsOpened = false;
        // if (focusToHost) {
        //     const x = window.scrollX, y = window.scrollY;
        //     this.mainElRef.nativeElement.focus();
        //     window.scrollTo(x, y);
        // }
        this.close.emit();

        if (this.autoClearSearch && this.multiple && this.inputElRef) {
            this.inputElRef.nativeElement.value = null;
        }
    }

    private buildOptions(data: any[]): Array<NgxSelectOption | NgxSelectOptGroup> {
        const result: Array<NgxSelectOption | NgxSelectOptGroup> = [];
        if (Array.isArray(data)) {
            let option: NgxSelectOption;
            data.forEach((item: any) => {
                const isOptGroup = typeof item === 'object' && item !== null &&
                    propertyExists(item, this.optGroupLabelField) && propertyExists(item, this.optGroupOptionsField) &&
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
        let value, text, disabled;
        if (typeof data === 'string' || typeof data === 'number') {
            value = text = data;
            disabled = false;
        } else if (typeof data === 'object' && data !== null &&
            (propertyExists(data, this.optionValueField) || propertyExists(data, this.optionTextField))) {
            value = propertyExists(data, this.optionValueField) ? data[this.optionValueField] : data[this.optionTextField];
            text = propertyExists(data, this.optionTextField) ? data[this.optionTextField] : data[this.optionValueField];
            disabled = propertyExists(data, 'disabled') ? data['disabled'] : false;
        } else {
            return null;
        }
        return new NgxSelectOption(value, text, disabled, data, parent);
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
