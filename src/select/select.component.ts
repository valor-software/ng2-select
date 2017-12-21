import { Component, Input, Output, EventEmitter, ElementRef, OnInit, forwardRef, AfterContentChecked } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SelectItem } from './select-item';
import { OptionsBehavior } from './select-interfaces';
import { escapeRegexp } from './common';
import { KeyboardEvent } from 'ngx-bootstrap/utils/facade/browser';

function stripTags(input: string): string {
  const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  const commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '').replace(tags, '');
}

@Component({
  selector: 'ng-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements OnInit, ControlValueAccessor, AfterContentChecked {
  @Input() public allowClear: boolean = false;
  @Input() public placeholder: string = '';
  @Input() public idField: string = 'id';
  @Input() public textField: string = 'text';
  @Input() public childrenField: string = 'children';
  @Input() public multiple: boolean = false;
  @Input() public noAutoComplete: boolean = false;

  @Input()
  public set items(value: Array<any>) {
    if (value) {
      this._items = value.filter((item: any) => {
        if ((typeof item === 'string') || (typeof item === 'object' && item && item[this.textField] && item[this.idField])) {
          return item;
        }
      });
      this.itemObjects = this._items.map((item: any) => (typeof item === 'string' ? new SelectItem(item) : new SelectItem({
        id: item[this.idField],
        text: item[this.textField],
        children: item[this.childrenField]
      })));
    } else {
      this._items = this.itemObjects = [];
    }
  }

  @Input()
  public set disabled(value: boolean) {
    this._disabled = value;
    if (this._disabled === true) {
      this.hideOptions();
    }
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  public set active(selectedItems: Array<any>) {
    if (selectedItems && selectedItems.length) {
      this._active = selectedItems.map((item: any) => {
        const data = typeof selectedItems[0] === 'string'
          ? item
          : {id: item[this.idField], text: item[this.textField]};
        return new SelectItem(data);
      });
    } else {
      this._active = [];
    }
  }

  @Output() public data: EventEmitter<any> = new EventEmitter();
  @Output() public selected: EventEmitter<any> = new EventEmitter();
  @Output() public removed: EventEmitter<any> = new EventEmitter();
  @Output() public typed: EventEmitter<any> = new EventEmitter();
  @Output() public opened: EventEmitter<any> = new EventEmitter();

  public options: Array<SelectItem> = [];
  public itemObjects: Array<SelectItem> = [];
  public activeOption: SelectItem;
  public element: ElementRef;

  public get active(): Array<any> {
    return this._active;
  }

  public set optionsOpened(value: boolean) {
    if (this._optionsOpened !== value) {
      this._optionsOpened = value;
      this.opened.emit(value);
    }
  }

  public get optionsOpened(): boolean {
    return this._optionsOpened;
  }

  protected onChange: any = Function.prototype;
  protected onTouched: any = Function.prototype;

  public inputMode: boolean = false;
  private _optionsOpened: boolean = false;
  private behavior: OptionsBehavior;
  private inputValue: string = '';
  private _items: Array<any> = [];
  private _disabled: boolean = false;
  private _active: Array<SelectItem> = [];
  private _focusValueToInput: any = false;
  static list: Array<any> = [];

  public constructor(element: ElementRef, private sanitizer: DomSanitizer) {
    this.element = element;
    this.clickedOutside = this.clickedOutside.bind(this);
    SelectComponent.list.push(this);
  }

  public sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  public inputEvent(e: KeyboardEvent, isUpMode: boolean = false): void {
    // tab
    if (e.keyCode === 9) {
      return;
    }
    if (isUpMode && (e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 38 ||
        e.keyCode === 40 || e.keyCode === 13)) {
      e.preventDefault();
      return;
    }
    // backspace
    if (!isUpMode && e.keyCode === 8) {
      const el: any = this.element.nativeElement.querySelector('div.ui-select-container > input');
      if (!el.value || el.value.length <= 0) {
        if (this.active.length > 0) {
          this.remove(this.active[this.active.length - 1]);
        }
        e.preventDefault();
      }
    }
    // esc
    if (!isUpMode && e.keyCode === 27) {
      this.hideOptions();
      this.element.nativeElement.children[0].focus();
      e.preventDefault();
      return;
    }
    // del
    if (!isUpMode && e.keyCode === 46) {
      if (this.active.length > 0) {
        this.remove(this.active[this.active.length - 1]);
      }
      e.preventDefault();
    }
    // left
    if (!isUpMode && e.keyCode === 37 && this._items.length > 0) {
      this.behavior.first();
      e.preventDefault();
      return;
    }
    // right
    if (!isUpMode && e.keyCode === 39 && this._items.length > 0) {
      this.behavior.last();
      e.preventDefault();
      return;
    }
    if (!isUpMode && e.keyCode === 38) {
    // up
      this.behavior.prev();
      e.preventDefault();
      return;
    }
    // down
    if (!isUpMode && e.keyCode === 40) {
      this.behavior.next();
      e.preventDefault();
      return;
    }
    // enter
    if (!isUpMode && e.keyCode === 13) {
      if (this.options.length <= 0 && this.inputValue !== '') {
        const newValue = new SelectItem(this.inputValue);
        console.log(JSON.stringify(newValue, null, 4));
        this.itemObjects.push(newValue);

        if (this.active.indexOf(newValue) === -1) {
          this.active.push(newValue);
          this.data.next(this.active);
          this.behavior.next();

          console.log(JSON.stringify(this.active, null, 4));
        }

        this.doEvent('selected', newValue);
        this.hideOptions();
        if (this.multiple === true) {
          this.focusToInput('');
        } else {
          this.focusToInput(stripTags(newValue.text));
          this.element.nativeElement.querySelector('.ui-select-container').focus();
        }
        // Clear input
        const target: HTMLInputElement = <HTMLInputElement>(e.target || e.srcElement);
        target.value = '';
      } else {
        if (this.active.indexOf(this.activeOption) === -1) {
          this.selectActiveMatch();
          this.behavior.next();
        }
        e.preventDefault();
      }

      return;
    }
    const target: HTMLInputElement = <HTMLInputElement>(e.target || e.srcElement);
    if (target && target.value) {
      this.inputValue = target.value;
      this.behavior.filter(new RegExp(escapeRegexp(this.inputValue), 'ig'));
      this.doEvent('typed', this.inputValue);
    } else {
      this.open();
    }
  }

  public ngOnInit(): any {
    this.behavior = this.firstItemHasChildren ? new ChildrenBehavior(this) : new GenericBehavior(this);
  }

  public ngAfterContentChecked(): void {
    const el: HTMLInputElement = this.element.nativeElement.querySelector('div.ui-select-container > input');
    if ((this._focusValueToInput !== false) && el) {
      if (el) {
        el.focus();
        el.value = this._focusValueToInput;
      }
      this._focusValueToInput = false;
    }
  }

  public remove(item: SelectItem): void {
    if (this._disabled === true) {
      return;
    }
    if (this.multiple === true && this.active) {
      const index = this.active.indexOf(item);
      this.active.splice(index, 1);
      this.data.next(this.active);
      this.doEvent('removed', item);
    }
    if (this.multiple === false) {
      this.active = [];
      this.data.next(this.active);
      this.doEvent('removed', item);
    }
  }

  public doEvent(type: string, value: any): void {
    if ((this as any)[type] && value) {
      (this as any)[type].next(value);
    }

    this.onTouched();
    if (type === 'selected' || type === 'removed') {
      this.onChange(this.active);
    }
  }

  public clickedOutside(): void {
    this.inputMode = false;
    this.optionsOpened = false;
  }

  public get firstItemHasChildren(): boolean {
    return this.itemObjects[0] && this.itemObjects[0].hasChildren();
  }

  public writeValue(val: any): void {
    this.active = val;
    this.data.emit(this.active);
  }

  public validate(c: FormControl): any {
    const controlValue = c && c.value ? c.value : [];

    return this.allowClear || this.multiple || (controlValue.length > 0) ? null : {
      ng2SelectEmptyError: {
        valid: false
      }
    };
  }

  public registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  protected matchClick(e: any): void {
    if (this._disabled === true) {
      return;
    }
    this.inputMode = !this.inputMode;
    if (this.inputMode === true && ((this.multiple === true && e) || this.multiple === false)) {
      if (!this.noAutoComplete) {
        this.focusToInput();
      }
      this.open();
    }
  }

  public mainClick(event: KeyboardEvent): void {
    if (this.inputMode === true || this._disabled === true) {
      return;
    }
    if (event.keyCode === 46) {
      event.preventDefault();
      this.inputEvent(event);
      return;
    }
    if (event.keyCode === 8) {
      event.preventDefault();
      this.inputEvent(event, true);
      return;
    }
    if (event.keyCode === 9 || event.keyCode === 13 ||
      event.keyCode === 27 || (event.keyCode >= 37 && event.keyCode <= 40)) {
      event.preventDefault();
      return;
    }
    this.inputMode = true;
    const value = String
      .fromCharCode(96 <= event.keyCode && event.keyCode <= 105 ? event.keyCode - 48 : event.keyCode)
      .toLowerCase();
    this.focusToInput(value);
    this.open();
    const target: HTMLInputElement = <HTMLInputElement>(event.target || event.srcElement);
    target.value = value;
    this.inputEvent(event);
  }

  protected selectActive(value: SelectItem): void {
    this.activeOption = value;
  }

  protected isActive(value: SelectItem): boolean {
    return this.activeOption && this.activeOption.id === value.id;
  }

  protected removeClick(value: SelectItem, event: any): void {
    event.stopPropagation();
    this.remove(value);
  }

  public focusToInput(value: string = ''): void {
    this._focusValueToInput = value;
  }

  private open(): void {
    this.options = this.itemObjects
      .filter((option: SelectItem) => (this.multiple === false ||
        this.multiple === true && !this.active.find((o: SelectItem) => option.text === o.text)));
    this.optionsOpened = true;
    // todo: fix scrolling to active item after open. setTimeout - is bad approach
    // setTimeout(() => {
    if (this.options.length > 0 && !(this.behavior as any).actor.activeOption) {
      this.behavior.first();
    } else {
      this.behavior.current();
    }
    // }, 0);
  }

  private hideOptions(): void {
    this.inputMode = false;
    this.optionsOpened = false;
  }

  private selectActiveMatch(): void {
    this.selectMatch(this.activeOption);
  }

  private selectMatch(value: SelectItem, event: Event = null): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (this.options.length <= 0) {
      return;
    }
    if (this.multiple === true) {
      this.active.push(value);
      this.data.next(this.active);
    }
    if (this.multiple === false) {
      this.active[0] = value;
      this.data.next(this.active[0]);
    }
    this.doEvent('selected', value);
    this.hideOptions();
    if (this.multiple === true) {
      this.focusToInput('');
    } else {
      if (!this.noAutoComplete) {
        this.focusToInput(stripTags(value.text));
      }
      this.element.nativeElement.querySelector('.ui-select-container').focus();
    }
  }
}

export class Behavior {
  public optionsMap: Map<string, number> = new Map<string, number>();

  public actor: SelectComponent;

  public constructor(actor: SelectComponent) {
    this.actor = actor;
  }

  public fillOptionsMap(): void {
    this.optionsMap.clear();
    let startPos = 0;
    this.actor.itemObjects
      .map((item: SelectItem) => {
        startPos = item.fillChildrenHash(this.optionsMap, startPos);
      });
  }

  public ensureHighlightVisible(optionsMap: Map<string, number> = void 0): void {
    const container = this.actor.element.nativeElement.querySelector('.ui-select-choices-content');
    if (!container) {
      return;
    }
    const choices = container.querySelectorAll('.ui-select-choices-row');
    if (choices.length < 1) {
      return;
    }
    const activeIndex = this.getActiveIndex(optionsMap);
    if (activeIndex < 0) {
      return;
    }
    const highlighted: any = choices[activeIndex];
    if (!highlighted) {
      return;
    }
    const posY: number = highlighted.offsetTop + highlighted.clientHeight - container.scrollTop;
    const height: number = container.offsetHeight;
    if (posY > height) {
      container.scrollTop += posY - height;
    } else if (posY < highlighted.clientHeight) {
      container.scrollTop -= highlighted.clientHeight - posY;
    }
  }

  private getActiveIndex(optionsMap: Map<string, number> = null): number {
    let ai = this.actor.options.indexOf(this.actor.activeOption);
    if (ai < 0 && optionsMap !== null) {
      ai = optionsMap.get(this.actor.activeOption.id);
    }
    return ai;
  }
}

export class GenericBehavior extends Behavior implements OptionsBehavior {
  public constructor(actor: SelectComponent) {
    super(actor);
  }

  public first(): void {
    this.actor.activeOption = this.actor.options[0];
    super.ensureHighlightVisible();
  }

  public current(): void {
    super.ensureHighlightVisible();
  }

  public last(): void {
    this.actor.activeOption = this.actor.options[this.actor.options.length - 1];
    super.ensureHighlightVisible();
  }

  public prev(): void {
    const index = this.actor.options.indexOf(this.actor.activeOption);
    this.actor.activeOption = this.actor
      .options[index - 1 < 0 ? this.actor.options.length - 1 : index - 1];
    super.ensureHighlightVisible();
  }

  public next(): void {
    const index = this.actor.options.indexOf(this.actor.activeOption);
    this.actor.activeOption = this.actor
      .options[index + 1 > this.actor.options.length - 1 ? 0 : index + 1];
    super.ensureHighlightVisible();
  }

  public filter(query: RegExp): void {
    this.actor.options = this.actor.itemObjects
      .filter((option: SelectItem) => {
        return stripTags(option.text).match(query) &&
          (this.actor.multiple === false ||
            (this.actor.multiple === true && this.actor.active.map((item: SelectItem) => item.id).indexOf(option.id) < 0));
      });

    if (this.actor.options.length > 0) {
      this.actor.activeOption = this.actor.options[0];
      super.ensureHighlightVisible();
    }
  }
}

export class ChildrenBehavior extends Behavior implements OptionsBehavior {
  public constructor(actor: SelectComponent) {
    super(actor);
  }

  public first(): void {
    this.actor.activeOption = this.actor.options[0].children[0];
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public current(): void {
    this.ensureHighlightVisible(this.optionsMap);
  }

  public last(): void {
    this.actor.activeOption = this.actor
      .options[this.actor.options.length - 1]
      .children[this.actor.options[this.actor.options.length - 1].children.length - 1];
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public prev(): void {
    const indexParent = this.actor.options.findIndex((option: SelectItem) =>
      this.actor.activeOption.parent && this.actor.activeOption.parent.id === option.id
    );
    const index = this.actor.options[indexParent].children.findIndex((option: SelectItem) =>
      this.actor.activeOption && this.actor.activeOption.id === option.id
    );
    this.actor.activeOption = this.actor.options[indexParent].children[index - 1];
    if (!this.actor.activeOption) {
      if (this.actor.options[indexParent - 1]) {
        this.actor.activeOption = this.actor
          .options[indexParent - 1]
          .children[this.actor.options[indexParent - 1].children.length - 1];
      }
      this.last();
    }
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public next(): void {
    const indexParent = this.actor.options.findIndex((option: SelectItem) =>
      this.actor.activeOption.parent && this.actor.activeOption.parent.id === option.id
    );
    const index = this.actor.options[indexParent].children.findIndex((option: SelectItem) =>
      this.actor.activeOption && this.actor.activeOption.id === option.id
    );
    this.actor.activeOption = this.actor.options[indexParent].children[index + 1];
    if (!this.actor.activeOption) {
      if (this.actor.options[indexParent + 1]) {
        this.actor.activeOption = this.actor.options[indexParent + 1].children[0];
      }
      this.first();
    }
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public filter(query: RegExp): void {
    const options: Array<SelectItem> = [];
    const optionsMap: Map<string, number> = new Map<string, number>();
    let startPos = 0;
    for (const si of this.actor.itemObjects) {
      const children: Array<SelectItem> = si.children.filter((option: SelectItem) => query.test(option.text));
      startPos = si.fillChildrenHash(optionsMap, startPos);
      if (children.length > 0) {
        const newSi = si.getSimilar();
        newSi.children = children;
        options.push(newSi);
      }
    }
    this.actor.options = options;
    if (this.actor.options.length > 0) {
      this.actor.activeOption = this.actor.options[0].children[0];
      super.ensureHighlightVisible(optionsMap);
    }
  }
}
