import { Component, Input, Output, EventEmitter, ElementRef, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { stripTags } from './select-pipes';
import { OptionsBehavior } from './select-interfaces';
import { escapeRegexp } from './common';

let styles = `
.ui-select-match {
  padding: 0;
}

.ui-select-toggle {
  position: relative;
  border: 0;
  outline: 0;
  width: 100%;
  height: 100%;
}

/* Fix caret going into new line in Firefox */
.ui-select-placeholder {
  float: left;
}

/* Fix Bootstrap dropdown position when inside a input-group */
/*
  TODO: this does not work with Angular2 css encapsulation!
  (but this should really be fixed upstream in Bootstrap)
*/
.input-group > .dropdown {
  /* Instead of relative */
  position: static !important;
}

.ui-select-match > .btn {
  /* Instead of center because of .btn */
  text-align: left !important;
}

.ui-select-match > .caret {
  position: absolute;
  top: 45%;
  right: 15px;
}

.ui-disabled {
  background-color: #eceeef;
  border-radius: 4px;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 5;
  opacity: 0.6;
  top: 0;
  left: 0;
  cursor: not-allowed;
}

.ui-select-choices {
  width: 100%;
  height: auto;
  max-height: 200px;
  overflow-x: hidden;
  margin-top: 0;
}

.ui-select-multiple .ui-select-choices {
  margin-top: 1px;
}

.ui-select-multiple {
  height: auto;
}

.ui-select-multiple input.ui-select-search {
  background-color: transparent !important; /* To prevent double background when disabled */
  border: none;
  outline: none;
  box-shadow: none;
  padding: 0;
}

.ui-select-multiple .ui-select-match-item {
  outline: 0;
  margin-bottom: 0.25rem;
}
.ui-select-multiple .ui-select-match-item:not(:last-child) {
  margin-right: 0.25rem;
}

.ui-select-match-item-close {
  padding: 0;
  line-height: 0.8;
  overflow: hidden;
  cursor: pointer;
}

.ui-select-toggle .ui-select-match-item-close {
  margin-right: 10px;
}

.ui-select-multiple .ui-select-match-item-close {
  margin-left: 10px;
}
`;

@Component({
  selector: 'ng-select',
  styles: [styles],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      /* tslint:disable */
      useExisting: forwardRef(() => SelectComponent),
      /* tslint:enable */
      multi: true
    }
  ],
  template: `
  <div tabindex="0"
     *ngIf="multiple === false"
     (keyup)="mainClick($event)"
     [offClick]="clickedOutside"
     class="ui-select-container"
     [ngClass]="dropdownClass + ' ' + openClass">
    <div [ngClass]="{'ui-disabled': disabled}"></div>
    <div class="ui-select-match"
        [ngClass]="inputClass"
        *ngIf="!inputMode">
      <span tabindex="-1"
          class="ui-select-toggle"
          [ngClass]="buttonClass"
          (click)="matchClick($event)">
        <span *ngIf="active.length <= 0" class="ui-select-placeholder" [ngClass]="placeholderTextClass">{{placeholder}}</span>
        <span *ngIf="active.length > 0" class="ui-select-match-text"
              [ngClass]="activeTextPositionClass + (allowClear && active.length > 0 ? ' ui-select-allow-clear' : '')"
              [innerHTML]="sanitize(active[0][textField])"></span>
        <i [ngClass]="caretIconClass + ' ' + iconPositionClass" aria-hidden="true"></i>
        <a *ngIf="allowClear && active.length>0"
          [ngClass]="closeIconClass + ' ' + iconPositionClass"
          class="ui-select-match-item-close"
          (click)="removeClick(active[0], $event)">
          &times;
        </a>
      </span>
    </div>
    <input type="text" autocomplete="false" tabindex="-1"
           (keydown)="inputEvent($event)"
           (keyup)="inputEvent($event, true)"
           [disabled]="disabled"
           class="ui-select-search"
           [ngClass]="inputClass"
           *ngIf="inputMode"
           placeholder="{{active.length <= 0 ? placeholder : ''}}">
    <!-- options template -->
    <ul *ngIf="optionsOpened && options && options.length > 0 && !firstItemHasChildren"
        class="ui-select-choices" [ngClass]="dropdownMenuClass + ' ' + openClass" role="menu">
      <li *ngFor="let o of options" role="menuitem" [ngClass]="(isActive(o) ? dropdownItemActiveClass : '')">
        <a href="javascript:void(0)"
          [ngClass]="dropdownItemClass + (isActive(o) ? ' ' + dropdownItemActiveClass : '')"
          (mouseenter)="selectMarked(o)"
          (click)="selectMatch(o, $event)">
          <div [innerHtml]="sanitize(o[textField] | highlight:inputValue)"></div>
        </a>
      </li>
    </ul>

    <ul *ngIf="optionsOpened && options && options.length > 0 && firstItemHasChildren"
        class="ui-select-choices" [ngClass]="dropdownMenuClass + ' ' + openClass" role="menu">
      <ng-container *ngFor="let c of options; let index=index">
        <li role="separator" [ngClass]="dropdownDividerClass" *ngIf="index > 0"></li>
        <li [ngClass]="dropdownHeaderClass">{{c[textField]}}</li>
        <li *ngFor="let o of c[childrenField]" role="menuitem" [ngClass]="(isActive(o) ? dropdownItemActiveClass : '')">
          <a href="javascript:void(0)"
            [ngClass]="dropdownItemClass + (isActive(o) ? ' ' + dropdownItemActiveClass : '')"
            (mouseenter)="selectMarked(o)"
            (click)="selectMatch(o, $event)">
            <div [innerHtml]="sanitize(o[textField] | highlight:inputValue)"></div>
          </a>
        </li>
      </ng-container>
    </ul>
  </div>

  <div tabindex="0"
     *ngIf="multiple === true"
     (keyup)="mainClick($event)"
     (focus)="focusToInput('')"
     [offClick]="clickedOutside"
     class="ui-select-container ui-select-multiple"
     [ngClass]="inputClass + ' ' + dropdownClass + ' ' + openClass">
    <div [ngClass]="{'ui-disabled': disabled}"></div>
    <div class="ui-select-match" [ngClass]="multiButtonContainerClass">
      <span *ngFor="let a of active"
            class="ui-select-match-item"
            tabindex="-1"
            [ngClass]="buttonClass">
        <a [ngClass]="closeIconClass"
          class="ui-select-match-item-close"
          (click)="removeClick(a, $event)">&times;</a>
        <span [innerHtml]="sanitize(a[textField])"></span>
      </span>
    </div>
    <input type="text"
           (keydown)="inputEvent($event)"
           (keyup)="inputEvent($event, true)"
           (click)="matchClick($event)"
           [disabled]="disabled"
           autocomplete="false"
           autocorrect="off"
           autocapitalize="off"
           spellcheck="false"
           class="ui-select-search"
           [ngClass]="inputClass"
           placeholder="{{active.length <= 0 ? placeholder : ''}}"
           role="combobox">
    <!-- options template -->
    <ul *ngIf="optionsOpened && options && options.length > 0 && !firstItemHasChildren"
        class="ui-select-choices" [ngClass]="dropdownMenuClass + ' ' + openClass" role="menu">
      <li *ngFor="let o of options" role="menuitem" [ngClass]="(isActive(o) ? dropdownItemActiveClass : '')">
        <a href="javascript:void(0)"
          [ngClass]="dropdownItemClass + (isActive(o) ? ' ' + dropdownItemActiveClass : '')"
          (mouseenter)="selectMarked(o)"
          (click)="selectMatch(o, $event)">
          <div [innerHtml]="sanitize(o[textField] | highlight:inputValue)"></div>
        </a>
      </li>
    </ul>

    <ul *ngIf="optionsOpened && options && options.length > 0 && firstItemHasChildren"
        class="ui-select-choices" [ngClass]="dropdownMenuClass + ' ' + openClass" role="menu">
      <ng-container *ngFor="let c of options; let index=index">
        <li role="separator" [ngClass]="dropdownDividerClass" *ngIf="index > 0"></li>
        <li [ngClass]="dropdownHeaderClass">{{c[textField]}}</li>
        <li *ngFor="let o of c[childrenField]" role="menuitem" [ngClass]="(isActive(o) ? dropdownItemActiveClass : '')">
          <a href="javascript:void(0)"
            [ngClass]="dropdownItemClass + (isActive(o) ? ' ' + dropdownItemActiveClass : '')"
            (mouseenter)="selectMarked(o)"
            (click)="selectMatch(o, $event)">
            <div [innerHtml]="sanitize(o[textField] | highlight:inputValue)"></div>
          </a>
        </li>
      </ng-container>
    </ul>
  </div>
  `
})
export class SelectComponent implements OnInit, ControlValueAccessor {
  @Input() public multiButtonContainerClass:string = 'btn-toolbar';
  @Input() public buttonClass:string = 'btn btn-default btn-outline-secondary';
  @Input() public inputClass:string = 'form-control';
  @Input() public dropdownClass:string = 'dropdown';
  @Input() public dropdownMenuClass:string = 'dropdown-menu';
  @Input() public dropdownItemClass:string = 'dropdown-item';
  @Input() public dropdownItemActiveClass:string = 'active';
  @Input() public dropdownDividerClass:string = 'divider dropdown-divider';
  @Input() public dropdownHeaderClass:string = 'dropdown-header';
  @Input() public openClass:string = 'open show';
  @Input() public caretIconClass:string = 'dropdown-toggle caret';
  @Input() public closeIconClass:string = 'close';
  @Input() public iconPositionClass:string = 'pull-right float-right';
  @Input() public placeholderTextClass:string = 'text-muted';
  @Input() public activeTextPositionClass:string = 'pull-left float-left';

  @Input() public allowClear:boolean = false;
  @Input() public placeholder:string = '';
  @Input() public idField:string = 'id';
  @Input() public textField:string = 'text';
  @Input() public childrenField:string = 'children';
  @Input() public parentField:string = 'parent';
  @Input() public multiple:boolean = false;

  @Input()
  public set items(value:any[]) {
    this._items = this._getValidatedArray(value);
  }
  public get items(): any[] {
    return this._items;
  }

  @Input()
  public set disabled(value:boolean) {
    this._disabled = value;
    if (this._disabled === true) {
      this.hideOptions();
    }
  }

  public get disabled():boolean {
    return this._disabled;
  }

  @Input()
  public set active(selectedItems:any[]) {
    this._active = this._getValidatedArray(selectedItems);
  }

  @Output() public data:EventEmitter<any> = new EventEmitter();
  @Output() public selected:EventEmitter<any> = new EventEmitter();
  @Output() public removed:EventEmitter<any> = new EventEmitter();
  @Output() public typed:EventEmitter<any> = new EventEmitter();
  @Output() public opened:EventEmitter<any> = new EventEmitter();

  public options:any[] = [];
  public markedOption:any;
  public element:ElementRef;

  public get active():any[] {
    return this._active;
  }

  public set optionsOpened(value:boolean){
    this._optionsOpened = value;
    this.opened.emit(value);
  }

  public get optionsOpened(): boolean{
    return this._optionsOpened;
  }

  protected onChange:any = Function.prototype;
  protected onTouched:any = Function.prototype;

  public inputMode:boolean = false;
  public inputValue:string = '';

  private _optionsOpened:boolean = false;
  private behavior:OptionsBehavior;
  private _items:any[] = [];
  private _disabled:boolean = false;
  private _active:any[] = [];

  public constructor(element:ElementRef, private sanitizer:DomSanitizer) {
    this.element = element;
    this.clickedOutside = this.clickedOutside.bind(this);
  }

  public sanitize(html:string):SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  public inputEvent(e:any, isUpMode:boolean = false):void {
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
      let el:any = this.element.nativeElement
        .querySelector('div.ui-select-container > input');

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
      this.element.nativeElement[this.childrenField][0].focus();
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
    // up
    if (!isUpMode && e.keyCode === 38) {
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
      if (this.active.indexOf(this.markedOption) === -1) {
        this.selectMarkedMatch();
        this.behavior.next();
      }
      e.preventDefault();
      return;
    }
    let target = e.target || e.srcElement;
    if (target && target.value) {
      this.inputValue = target.value;
      this.behavior.filter(new RegExp(escapeRegexp(this.inputValue), 'ig'));
      this.doEvent('typed', this.inputValue);
    }else {
      this.open();
    }
  }

  public ngOnInit():any {
    this.behavior = (this.firstItemHasChildren) ?
      new ChildrenBehavior(this) : new GenericBehavior(this);
  }

  public remove(item:any):void {
    if (this._disabled === true) {
      return;
    }
    if (this.multiple === true && this.active) {
      let index = this.active.indexOf(item);
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

  public doEvent(type:string, value:any):void {
    if ((this as any)[type] && value) {
      (this as any)[type].next(value);
    }

    this.onTouched();
    if (type === 'selected' || type === 'removed') {
      this.onChange(this.active);
    }
  }

  public clickedOutside():void {
    this.inputMode = false;
    this.optionsOpened = false;
  }

  public get firstItemHasChildren():boolean {
    return this._items[0] &&
            this._items[0][this.childrenField] &&
            Array.isArray(this._items[0][this.childrenField]) &&
            this._items[0][this.childrenField].length > 0;
  }

  public writeValue(val:any):void {
    this.active = val;
    this.data.emit(this.active);
  }

  public registerOnChange(fn:(_:any) => {}):void {this.onChange = fn;}
  public registerOnTouched(fn:() => {}):void {this.onTouched = fn;}

  public matchClick(e:any):void {
    if (this._disabled === true) {
      return;
    }
    this.inputMode = !this.inputMode;
    if (this.inputMode === true && ((this.multiple === true && e) || this.multiple === false)) {
      this.focusToInput();
      this.open();
    }
  }

  public  mainClick(event:any):void {
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
    let value = String
      .fromCharCode(96 <= event.keyCode && event.keyCode <= 105 ? event.keyCode - 48 : event.keyCode)
      .toLowerCase();
    this.focusToInput(value);
    this.open();
    let target = event.target || event.srcElement;
    target.value = value;
    this.inputEvent(event);
  }

  public  selectMarked(value:any):void {
    this.markedOption = value;
  }

  public  isActive(value:any):boolean {
    return this.active.find((o:any) => value[this.idField] === o[this.idField]);
    // return this.markedOption[this.idField] === value[this.idField];
  }

  public removeClick(value: any, event: any): void {
    event.stopPropagation();
    this.remove(value);
  }

  public focusToInput(value:string = ''):void {
    setTimeout(() => {
      let el = this.element.nativeElement.querySelector('div.ui-select-container > input');
      if (el) {
        el.focus();
        el.value = value;
      }
    }, 0);
  }

  public selectMatch(value:any, e:Event = void 0):void {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
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
      this.focusToInput(stripTags(value[this.textField]));
      this.element.nativeElement.querySelector('.ui-select-container').focus();
    }
  }

  private _getValidatedArray(value:any[]):any[] {
    if (!value || value.length === 0) {
      return [];
    } else {
      return value
        .filter((item:any) => item) // makes sure item exists
        .map((item:any) => {
          let data:any = {};
          if (typeof item === 'string') {
            data[this.idField] = item;
            data[this.textField] = item;
          } else if (typeof item === 'object') {
            data = this._addParent(item);
          }

          return data;
        });
    }
  }

  private _addParent(item:any):any {
    let newItem:any = item;

    if ((typeof item === 'object') && item && item[this.childrenField] && Array.isArray(item[this.childrenField])) {
      newItem[this.childrenField] = this._getValidatedArray(item[this.childrenField]).map((c:any) => {
        let p:any = {};
        if (item[this.idField]) {
          p[this.idField] = item[this.idField];
        }
        if (item[this.textField]) {
          p[this.textField] = item[this.textField];
        }
        c[this.parentField] = p;
        return c;
      });
    }

    return newItem;
  }

  private open():void {
    this.options = this._items
      .filter((option:any) => (this.multiple === false ||
      this.multiple === true &&
      !this.active.find((o:any) => option[this.idField] === o[this.idField])));

    if (this.options.length > 0) {
      this.behavior.first();
    }
    this.optionsOpened = true;
  }

  private hideOptions():void {
    this.inputMode = false;
    this.optionsOpened = false;
  }

  private selectMarkedMatch():void {
    this.selectMatch(this.markedOption);
  }
}

export class Behavior {
  public optionsMap:Map<string, number> = new Map<string, number>();

  public actor:SelectComponent;

  public constructor(actor:SelectComponent) {
    this.actor = actor;
  }

  protected fillChildrenHash(item:any, optionsMap:Map<string, number>, startIndex:number):number {
    let i = startIndex;
    item[this.actor.childrenField].map((child:any) => {
      optionsMap.set(child[this.actor.idField], i++);
    });
    return i;
  }

  public fillOptionsMap():void {
    this.optionsMap.clear();
    let startPos = 0;
    this.actor.items
      .map((item:any) => {
        startPos = this.fillChildrenHash(item, this.optionsMap, startPos);
      });
  }

  public ensureHighlightVisible(optionsMap:Map<string, number> = void 0):void {
    let container = this.actor.element.nativeElement.querySelector('.ui-select-choices');
    if (!container) {
      return;
    }
    let choices = container.querySelectorAll('.ui-select-choices-row');
    if (choices.length < 1) {
      return;
    }
    let activeIndex = this.getActiveIndex(optionsMap);
    if (activeIndex < 0) {
      return;
    }
    let highlighted:any = choices[activeIndex];
    if (!highlighted) {
      return;
    }
    let posY:number = highlighted.offsetTop + highlighted.clientHeight - container.scrollTop;
    let height:number = container.offsetHeight;
    if (posY > height) {
      container.scrollTop += posY - height;
    } else if (posY < highlighted.clientHeight) {
      container.scrollTop -= highlighted.clientHeight - posY;
    }
  }

  private getActiveIndex(optionsMap:Map<string, number> = void 0):number {
    let ai = this.actor.options.indexOf(this.actor.markedOption);
    if (ai < 0 && optionsMap !== void 0) {
      ai = optionsMap.get(this.actor.markedOption[this.actor.idField]);
    }
    return ai;
  }
}

export class GenericBehavior extends Behavior implements OptionsBehavior {
  public constructor(actor:SelectComponent) {
    super(actor);
  }

  public first():void {
    this.actor.markedOption = this.actor.options[0];
    super.ensureHighlightVisible();
  }

  public last():void {
    this.actor.markedOption = this.actor.options[this.actor.options.length - 1];
    super.ensureHighlightVisible();
  }

  public prev():void {
    let index = this.actor.options.indexOf(this.actor.markedOption);
    this.actor.markedOption = this.actor
      .options[index - 1 < 0 ? this.actor.options.length - 1 : index - 1];
    super.ensureHighlightVisible();
  }

  public next():void {
    let index = this.actor.options.indexOf(this.actor.markedOption);
    this.actor.markedOption = this.actor
      .options[index + 1 > this.actor.options.length - 1 ? 0 : index + 1];
    super.ensureHighlightVisible();
  }

  public filter(query:RegExp):void {
    let options = this.actor.items
      .filter((option:any) => {
        return stripTags(option[this.actor.textField]).match(query) &&
          (this.actor.multiple === false ||
          (this.actor.multiple === true && this.actor.active.map((item: any) => item[this.actor.idField]).indexOf(option[this.actor.idField]) < 0));
      });
    this.actor.options = options;
    if (this.actor.options.length > 0) {
      this.actor.markedOption = this.actor.options[0];
      super.ensureHighlightVisible();
    }
  }
}

export class ChildrenBehavior extends Behavior implements OptionsBehavior {
  public constructor(actor:SelectComponent) {
    super(actor);
  }

  public first():void {
    this.actor.markedOption = this.actor.options[0][this.actor.childrenField][0];
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public last():void {
    this.actor.markedOption =
      this.actor
        .options[this.actor.options.length - 1]
        [this.actor.childrenField][this.actor.options[this.actor.options.length - 1][this.actor.childrenField].length - 1];
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public prev():void {
    let indexParent = this.actor.options
      .findIndex((option:any) => this.actor.markedOption[this.actor.parentField] && this.actor.markedOption[this.actor.parentField][this.actor.idField] === option[this.actor.idField]);
    let index = this.actor.options[indexParent][this.actor.childrenField]
      .findIndex((option:any) => this.actor.markedOption && this.actor.markedOption[this.actor.idField] === option[this.actor.idField]);
    this.actor.markedOption = this.actor.options[indexParent][this.actor.childrenField][index - 1];
    if (!this.actor.markedOption) {
      if (this.actor.options[indexParent - 1]) {
        this.actor.markedOption = this.actor
          .options[indexParent - 1]
          [this.actor.childrenField][this.actor.options[indexParent - 1][this.actor.childrenField].length - 1];
      }
    }
    if (!this.actor.markedOption) {
      this.last();
    }
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public next():void {
    let indexParent = this.actor.options
      .findIndex((option:any) => this.actor.markedOption[this.actor.parentField] && this.actor.markedOption[this.actor.parentField][this.actor.idField] === option[this.actor.idField]);
    let index = this.actor.options[indexParent][this.actor.childrenField]
      .findIndex((option:any) => this.actor.markedOption && this.actor.markedOption[this.actor.idField] === option[this.actor.idField]);
    this.actor.markedOption = this.actor.options[indexParent][this.actor.childrenField][index + 1];
    if (!this.actor.markedOption) {
      if (this.actor.options[indexParent + 1]) {
        this.actor.markedOption = this.actor.options[indexParent + 1][this.actor.childrenField][0];
      }
    }
    if (!this.actor.markedOption) {
      this.first();
    }
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public filter(query:RegExp):void {
    let options:any[] = [];
    let optionsMap:Map<string, number> = new Map<string, number>();
    let startPos = 0;
    for (let si of this.actor.items) {
      let children:any[] = si[this.actor.childrenField].filter((option:any) => query.test(option[this.actor.textField]));
      startPos = this.fillChildrenHash(si, optionsMap, startPos);
      if (children.length > 0) {
        let newSi = this._getSimilar(si);
        newSi[this.actor.childrenField] = children;
        options.push(newSi);
      }
    }
    this.actor.options = options;
    if (this.actor.options.length > 0) {
      this.actor.markedOption = this.actor.options[0][this.actor.childrenField][0];
      super.ensureHighlightVisible(optionsMap);
    }
  }

  private _getSimilar(item:any):any {
    let r:any = {};
    r[this.actor.idField] = item[this.actor.idField];
    r[this.actor.textField] = item[this.actor.textField];
    r[this.actor.parentField] = item[this.actor.parentField];
    return r;
  }
}
