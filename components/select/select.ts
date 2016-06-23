import {Component, Input, Output, EventEmitter, ElementRef, OnInit} from '@angular/core';
import {SelectItem} from './select-item';
import {HighlightPipe, stripTags} from './select-pipes';
import {OptionsBehavior} from './select-interfaces';
import {escapeRegexp} from './common';
import {OffClickDirective} from './off-click';

let styles = `
.ui-select-toggle {
  position: relative;

  /* hardcoded, should use variable from bootstrap */
  padding: 0.375rem 0.75rem;
}

/* Fix Bootstrap dropdown position when inside a input-group */
.input-group > .dropdown {
  /* Instead of relative */
  position: static;
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
  padding: 3px 3px 0 3px;
}

.ui-select-multiple input.ui-select-search {
  background-color: transparent !important; /* To prevent double background when disabled */
  border: none;
  outline: none;
  height: 1.9em;
  margin-bottom: 3px;

  /* hardcoded, should use variable from bootstrap, but must be adjusted because... reasons */
  padding: 0.375rem 0.55rem;
}

.ui-select-multiple .ui-select-match-item {
  outline: 0;
  margin: 0 3px 3px 0;
}
`;

let optionsTemplate = `
    <ul *ngIf="optionsOpened && options && options.length > 0 && !firstItemHasChildren"
        class="ui-select-choices dropdown-menu" role="menu">
      <li *ngFor="let o of options" role="menuitem">
        <div class="ui-select-choices-row"
             [class.active]="isActive(o)"
             (mouseenter)="selectActive(o)"
             (click)="selectMatch(o, $event)">
          <a href="javascript:void(0)" class="dropdown-item">
            <div [innerHtml]="o.text | highlight:inputValue"></div>
          </a>
        </div>
      </li>
    </ul>

    <ul *ngIf="optionsOpened && options && options.length > 0 && firstItemHasChildren"
        class="ui-select-choices dropdown-menu" role="menu">
      <li *ngFor="let c of options; let index=index" role="menuitem">
        <div class="divider dropdown-divider" *ngIf="index > 0"></div>
        <div class="dropdown-header">{{c.text}}</div>

        <div *ngFor="let o of c.children"
             class="ui-select-choices-row"
             [class.active]="isActive(o)"
             (mouseenter)="selectActive(o)"
             (click)="selectMatch(o, $event)"
             [ngClass]="{'active': isActive(o)}">
          <a href="javascript:void(0)" class="dropdown-item">
            <div [innerHtml]="o.text | highlight:inputValue"></div>
          </a>
        </div>
      </li>
    </ul>
`;

@Component({
  selector: 'ng-select',
  directives: [OffClickDirective],
  pipes: [HighlightPipe],
  styles: [styles],
  template: `
  <div tabindex="0"
     *ngIf="multiple === false"
     (keyup)="mainClick($event)"
     [offClick]="clickedOutside"
     class="ui-select-container dropdown open">
    <div [ngClass]="{'ui-disabled': disabled}"></div>
    <div class="ui-select-match"
         *ngIf="!inputMode">
      <span tabindex="-1"
          class="btn btn-default btn-secondary form-control ui-select-toggle"
          (click)="matchClick($event)"
          style="outline: 0;">
        <span *ngIf="active.length <= 0" class="ui-select-placeholder text-muted">{{placeholder}}</span>
        <span *ngIf="active.length > 0" class="ui-select-match-text pull-left"
              [ngClass]="{'ui-select-allow-clear': allowClear && active.length > 0}"
              [innerHTML]="active[0].text"></span>
        <i class="dropdown-toggle pull-right"></i>
        <i class="caret pull-right"></i>
        <a *ngIf="allowClear && active.length>0" style="margin-right: 10px; padding: 0;"
          (click)="remove(activeOption)" class="close pull-right">
          &times;
        </a>
      </span>
    </div>
    <input type="text" autocomplete="false" tabindex="-1"
           (keydown)="inputEvent($event)"
           (keyup)="inputEvent($event, true)"
           [disabled]="disabled"
           class="form-control ui-select-search"
           *ngIf="inputMode"
           placeholder="{{active.length <= 0 ? placeholder : ''}}">
      ${optionsTemplate}
  </div>

  <div tabindex="0"
     *ngIf="multiple === true"
     (keyup)="mainClick($event)"
     (focus)="focusToInput('')"
     class="ui-select-container ui-select-multiple dropdown form-control open">
    <div [ngClass]="{'ui-disabled': disabled}"></div>
    <span class="ui-select-match">
        <span *ngFor="let a of active">
            <span class="ui-select-match-item btn btn-default btn-secondary btn-sm"
                  tabindex="-1"
                  type="button"
                  [ngClass]="{'btn-default': true}">
               <a class="close"
                  style="margin-left: 10px; padding: 0;"
                  (click)="remove(a)">&times;</a>
               <span>{{a.text}}</span>
           </span>
        </span>
    </span>
    <input type="text"
           (keydown)="inputEvent($event)"
           (keyup)="inputEvent($event, true)"
           (click)="matchClick($event)"
           [disabled]="disabled"
           autocomplete="false"
           autocorrect="off"
           autocapitalize="off"
           spellcheck="false"
           class="form-control ui-select-search"
           placeholder="{{active.length <= 0 ? placeholder : ''}}"
           role="combobox">
    ${optionsTemplate}
  </div>
  `
})
export class SelectComponent implements OnInit {
  @Input() public allowClear:boolean = false;
  @Input() public placeholder:string = '';
  @Input() public idField:string = 'id';
  @Input() public textField:string = 'text';
  @Input() public initData:Array<any> = [];
  @Input() public multiple:boolean = false;

  @Input()
  public set items(value:Array<any>) {
    this._items = value;
    this.itemObjects = this._items.map((item:any) => (typeof item === 'string' ? new SelectItem(item) : new SelectItem({id: item[this.idField], text: item[this.textField]})));
  }

  @Input()
  public set disabled(value:boolean) {
    this._disabled = value;
    if (this._disabled === true) {
      this.hideOptions();
    }
  }

  @Output() public data:EventEmitter<any> = new EventEmitter();
  @Output() public selected:EventEmitter<any> = new EventEmitter();
  @Output() public removed:EventEmitter<any> = new EventEmitter();
  @Output() public typed:EventEmitter<any> = new EventEmitter();

  public options:Array<SelectItem> = [];
  public itemObjects:Array<SelectItem> = [];
  public active:Array<SelectItem> = [];
  public activeOption:SelectItem;
  public element:ElementRef;

  private inputMode:boolean = false;
  private optionsOpened:boolean = false;
  private behavior:OptionsBehavior;
  private inputValue:string = '';
  private _items:Array<any> = [];
  private _disabled:boolean = false;

  public constructor(element:ElementRef) {
    this.element = element;
    this.clickedOutside = this.clickedOutside.bind(this);
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
      if (this.active.indexOf(this.activeOption) === -1) {
        this.selectActiveMatch();
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
    }
  }

  public ngOnInit():any {
    this.behavior = (this.firstItemHasChildren) ?
      new ChildrenBehavior(this) : new GenericBehavior(this);
    if (this.initData) {
      this.active = this.initData.map((data:any) => (typeof data === 'string' ? new SelectItem(data) : new SelectItem({id: data[this.idField], text: data[this.textField]})));
      this.data.emit(this.active);
    }
  }

  public remove(item:SelectItem):void {
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
  }

  public clickedOutside():void  {
    this.inputMode = false;
    this.optionsOpened = false;
  }

  public get firstItemHasChildren():boolean {
    return this.itemObjects[0] && this.itemObjects[0].hasChildren();
  }

  protected matchClick(e:any):void {
    if (this._disabled === true) {
      return;
    }
    this.inputMode = !this.inputMode;
    if (this.inputMode === true && ((this.multiple === true && e) || this.multiple === false)) {
      this.focusToInput();
      this.open();
    }
  }

  protected  mainClick(event:any):void {
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

  protected  selectActive(value:SelectItem):void {
    this.activeOption = value;
  }

  protected  isActive(value:SelectItem):boolean {
    return this.activeOption.text === value.text;
  }

  private focusToInput(value:string = ''):void {
    setTimeout(() => {
      let el = this.element.nativeElement.querySelector('div.ui-select-container > input');
      if (el) {
        el.focus();
        el.value = value;
      }
    }, 0);
  }

  private open():void {
    this.options = this.itemObjects
      .filter((option: SelectItem) => (this.multiple === false ||
      this.multiple === true &&
      !this.active.find((o:SelectItem) => option.text === o.text)));

    if (this.options.length > 0) {
      this.behavior.first();
    }
    this.optionsOpened = true;
  }

  private hideOptions():void {
    this.inputMode = false;
    this.optionsOpened = false;
  }

  private selectActiveMatch():void {
    this.selectMatch(this.activeOption);
  }

  private selectMatch(value:SelectItem, e:Event = void 0):void {
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
      this.focusToInput(stripTags(value.text));
      this.element.nativeElement.querySelector('.ui-select-container').focus();
    }
  }
}

export class Behavior {
  public optionsMap:Map<string, number> = new Map<string, number>();

  public actor: SelectComponent;
  public constructor(actor:SelectComponent) {
    this.actor = actor;
  }

  public fillOptionsMap():void {
    this.optionsMap.clear();
    let startPos = 0;
    this.actor.itemObjects
      .map((item:SelectItem) => {
        startPos = item.fillChildrenHash(this.optionsMap, startPos);
      });
  }

  public ensureHighlightVisible(optionsMap:Map<string, number> = void 0):void {
    let container = this.actor.element.nativeElement.querySelector('.ui-select-choices-content');
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
    let ai = this.actor.options.indexOf(this.actor.activeOption);
    if (ai < 0 && optionsMap !== void 0) {
      ai = optionsMap.get(this.actor.activeOption.id);
    }
    return ai;
  }
}

export class GenericBehavior extends Behavior implements OptionsBehavior {
  public constructor(actor:SelectComponent) {
    super(actor);
  }

  public first():void {
    this.actor.activeOption = this.actor.options[0];
    super.ensureHighlightVisible();
  }

  public last():void {
    this.actor.activeOption = this.actor.options[this.actor.options.length - 1];
    super.ensureHighlightVisible();
  }

  public prev():void {
    let index = this.actor.options.indexOf(this.actor.activeOption);
    this.actor.activeOption = this.actor
      .options[index - 1 < 0 ? this.actor.options.length - 1 : index - 1];
    super.ensureHighlightVisible();
  }

  public next():void {
    let index = this.actor.options.indexOf(this.actor.activeOption);
    this.actor.activeOption = this.actor
      .options[index + 1 > this.actor.options.length - 1 ? 0 : index + 1];
    super.ensureHighlightVisible();
  }

  public filter(query:RegExp):void {
    let options = this.actor.itemObjects
      .filter((option:SelectItem) => {
        return stripTags(option.text).match(query) &&
          (this.actor.multiple === false ||
          (this.actor.multiple === true && this.actor.active.map((item: SelectItem) => item.id).indexOf(option.id) < 0));
      });
    this.actor.options = options;
    if (this.actor.options.length > 0) {
      this.actor.activeOption = this.actor.options[0];
      super.ensureHighlightVisible();
    }
  }
}

export class ChildrenBehavior extends Behavior implements OptionsBehavior {
  public constructor(actor:SelectComponent) {
    super(actor);
  }

  public first():void {
    this.actor.activeOption = this.actor.options[0].children[0];
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public last():void {
    this.actor.activeOption =
      this.actor
        .options[this.actor.options.length - 1]
        .children[this.actor.options[this.actor.options.length - 1].children.length - 1];
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public prev():void {
    let indexParent = this.actor.options
      .findIndex((option:SelectItem) => this.actor.activeOption.parent && this.actor.activeOption.parent.id === option.id);
    let index = this.actor.options[indexParent].children
      .findIndex((option:SelectItem) => this.actor.activeOption && this.actor.activeOption.id === option.id);
    this.actor.activeOption = this.actor.options[indexParent].children[index - 1];
    if (!this.actor.activeOption) {
      if (this.actor.options[indexParent - 1]) {
        this.actor.activeOption = this.actor
          .options[indexParent - 1]
          .children[this.actor.options[indexParent - 1].children.length - 1];
      }
    }
    if (!this.actor.activeOption) {
      this.last();
    }
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public next():void {
    let indexParent = this.actor.options
      .findIndex((option:SelectItem) => this.actor.activeOption.parent && this.actor.activeOption.parent.id === option.id);
    let index = this.actor.options[indexParent].children
      .findIndex((option:SelectItem) => this.actor.activeOption && this.actor.activeOption.id === option.id);
    this.actor.activeOption = this.actor.options[indexParent].children[index + 1];
    if (!this.actor.activeOption) {
      if (this.actor.options[indexParent + 1]) {
        this.actor.activeOption = this.actor.options[indexParent + 1].children[0];
      }
    }
    if (!this.actor.activeOption) {
      this.first();
    }
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public filter(query:RegExp):void {
    let options:Array<SelectItem> = [];
    let optionsMap:Map<string, number> = new Map<string, number>();
    let startPos = 0;
    for (let si of this.actor.itemObjects) {
      let children:Array<SelectItem> = si.children.filter((option:SelectItem) => query.test(option.text));
      startPos = si.fillChildrenHash(optionsMap, startPos);
      if (children.length > 0) {
        let newSi = si.getSimilar();
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
