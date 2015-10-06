/// <reference path="../../tsd.d.ts" />

import {
  Component, View, OnInit, OnDestroy,
  Directive, ViewEncapsulation, Self,
  EventEmitter, ElementRef, ComponentRef,
  DynamicComponentLoader,
  CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgStyle
} from 'angular2/angular2';

import {bind, forwardRef, ResolvedBinding, Injector} from 'angular2/di';

import {SelectItem} from './select-item';
import {IOptionsBehavior} from './select-interfaces';

let cssCommon = require('./common.css');

function getIndex(a:Array<SelectItem>, v:SelectItem):number {
  if (v) {
    for (let i = 0; i < a.length; i++) {
      if (a[i].id === v.id) {
        return i;
      }
    }
  }

  return -1;
}

let optionsTemplate = `
    <ul *ng-if="optionsOpened && options && options.length > 0 && !itemObjects[0].hasChildren()"
        class="ui-select-choices ui-select-choices-content ui-select-dropdown dropdown-menu">
      <li class="ui-select-choices-group">
        <div *ng-for="#o of options"
             class="ui-select-choices-row"
             (mouseenter)="selectActive(o)"
             (click)="selectMatch(o, $event)"
             [ng-class]="{'active': isActive(o)}">
          <a href="javascript:void(0)" class="ui-select-choices-row-inner">
            <div>{{o.text}}</div>
          </a>
        </div>
      </li>
    </ul>

    <ul *ng-if="optionsOpened && options && options.length > 0 && itemObjects[0].hasChildren()"
        class="ui-select-choices ui-select-choices-content ui-select-dropdown dropdown-menu">
      <li *ng-for="#c of options; #index=index" class="ui-select-choices-group">
        <div class="divider" *ng-if="index > 0"></div>
        <div class="ui-select-choices-group-label dropdown-header">{{c.text}}</div>

        <div *ng-for="#o of c.children"
             class="ui-select-choices-row"
             (mouseenter)="selectActive(o)"
             (click)="selectMatch(o, $event)"
             [ng-class]="{'active': isActive(o)}">
          <a href="javascript:void(0)" class="ui-select-choices-row-inner">
            <div>{{o.text}}</div>
          </a>
        </div>
      </li>
    </ul>
`;

@Component({
  selector: 'ng2-select',
  properties: [
    'allowClear',
    'placeholder',
    'initData:data',
    'items',
    'multiple'],
  events: ['selected', 'removed', 'data']
})
@View({
  template: `
<div tabindex="0"
     *ng-if="multiple === false"
     (keyup)="ff($event)"
     class="ui-select-container ui-select-bootstrap dropdown open">
    <div class="ui-select-match" *ng-if="!inputMode" class="btn-default-focus">
      <span tabindex="-1"
          class="btn btn-default form-control ui-select-toggle"
          (^click)="f()"
          style="outline: 0;">
        <span *ng-if="active.length <= 0" class="ui-select-placeholder text-muted">{{placeholder}}</span>
        <span *ng-if="active.length > 0" class="ui-select-match-text pull-left"
              [ng-class]="{'ui-select-allow-clear': allowClear && active.length > 0}">{{active[0].text}}</span>
        <i class="caret pull-right" ng-click="$select.toggle($event)"></i>
        <a *ng-if="allowClear && active.length>0" style="margin-right: 10px"
          (click)="remove(activeOption)" class="btn btn-xs btn-link pull-right">
          <i class="glyphicon glyphicon-remove"></i>
        </a>
      </span>
    </div>
    <input type="text" autocomplete="false" tabindex="-1"
           (keydown)="inputEvent($event)"
           (keyup)="inputEvent($event, true)"
           class="form-control ui-select-search"
           *ng-if="inputMode"
           placeholder="{{active.length <= 0 ? placeholder : ''}}">
    ${optionsTemplate}
</div>

<div tabindex="0"
     *ng-if="multiple === true"
     (keyup)="ff($event)"
     (focus)="focusToInput('')"
     class="ui-select-container ui-select-multiple ui-select-bootstrap dropdown form-control open">
    <span class="ui-select-match">
        <span *ng-for="#a of active">
            <span class="ui-select-match-item btn btn-default btn-xs"
                  tabindex="-1"
                  type="button"
                  [ng-class]="{'btn-default': true}">
               <a class="close ui-select-match-close"
                  (click)="remove(a)">&nbsp;&times;</a>
               <span>{{a.text}}</span>
           </span>
        </span>
    </span>
    <input type="text"
           (keydown)="inputEvent($event)"
           (keyup)="inputEvent($event, true)"
           (click)="f($event)"
           autocomplete="false"
           autocorrect="off"
           autocapitalize="off"
           spellcheck="false"
           class="ui-select-search input-xs"
           placeholder="{{active.length <= 0 ? placeholder : ''}}"
           role="combobox">
    ${optionsTemplate}
</div>
  `,
  styles: [cssCommon],
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class Select implements OnInit, OnDestroy {
  public multiple:boolean = false;
  public options:Array<SelectItem> = [];
  public itemObjects:Array<SelectItem> = [];
  public active:Array<SelectItem> = [];
  public activeOption:SelectItem;

  private data:EventEmitter = new EventEmitter();
  private selected:EventEmitter = new EventEmitter();
  private removed:EventEmitter = new EventEmitter();
  private allowClear:boolean = false;
  private placeholder:string = '';
  private initData:Array<any> = [];
  private _items:Array<any> = [];
  private offSideClickHandler:any;
  private inputMode:boolean = false;
  private optionsOpened:boolean = false;
  private behavior:IOptionsBehavior;

  constructor(public element:ElementRef) {
  }

  private focusToInput(value:string = '') {
    setTimeout(() => {
      let el = this.element.nativeElement.querySelector('div.ui-select-container > input');
      el.focus();
      el.value = value;
    }, 0);
  }

  private f(e:any) {
    this.inputMode = !this.inputMode;
    if (this.inputMode === true && ((this.multiple === true && e) || this.multiple === false)) {
      this.focusToInput();
      this.open();
    }
  }

  private ff(e:any) {
    if (this.inputMode === true) {
      return;
    }

    if (e.keyCode === 46) {
      e.preventDefault();
      this.inputEvent(e);
      return;
    }

    if (e.keyCode === 8) {
      e.preventDefault();
      this.inputEvent(e, true);
      return;
    }

    if (e.keyCode === 9 || e.keyCode === 13 ||
      e.keyCode === 27 || (e.keyCode >= 37 && e.keyCode <= 40)) {
      e.preventDefault();
      return;
    }

    this.inputMode = true;
    let value = String
      .fromCharCode(96 <= e.keyCode && e.keyCode <= 105 ? e.keyCode - 48 : e.keyCode)
      .toLowerCase();
    this.focusToInput(value);
    this.open();
    e.srcElement.value = value;
    this.inputEvent(e);
  }

  private open() {
    this.options = this.itemObjects
      .filter(option => (this.multiple === false ||
      this.multiple === true && !this.active.find(o => option.text === o.text)));

    if (this.options.length > 0) {
      this.behavior.first();
    }

    this.optionsOpened = true;
  }

  private get items():Array<any> {
    return this._items;
  }

  private set items(value:Array<any>) {
    this._items = value;
    this.itemObjects = this._items.map((item:any) => new SelectItem(item));
  }

  onInit() {
    this.behavior = this.itemObjects[0].hasChildren() ?
      new Select.ChildrenBehavior(this) : new Select.GenericBehavior(this);
    this.offSideClickHandler = this.getOffSideClickHandler(this);
    document.addEventListener('click', this.offSideClickHandler);

    if (this.initData) {
      this.active = this.initData.map(d => new SelectItem(d));
      this.data.next(this.active);
    }
  }

  onDestroy() {
    document.removeEventListener('click', this.offSideClickHandler);
    this.offSideClickHandler = null;
  }

  private getOffSideClickHandler(context:any) {
    return function (e:any) {
      if (e.target && e.target.nodeName === 'INPUT'
        && e.target.className && e.target.className.indexOf('ui-select') >= 0) {
        return;
      }

      if (e.srcElement && e.srcElement.className &&
        e.srcElement.className.indexOf('ui-select') >= 0) {
        if (e.target.nodeName !== 'INPUT') {
          context.f();
        }
        return;
      }

      context.inputMode = false;
      context.optionsOpened = false;
    };
  }

  public remove(item:SelectItem) {
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

  public doEvent(type:string, value:any) {
    if (this[type] && value) {
      this[type].next(value);
    }
  }

  private hideOptions() {
    this.inputMode = false;
    this.optionsOpened = false;
  }

  public inputEvent(e:any, isUpMode:boolean = false) {
    // tab
    if (e.keyCode === 9) {
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
    if (!isUpMode && e.keyCode === 37 && this.items.length > 0) {
      this.behavior.first();
      e.preventDefault();
      return;
    }

    // right
    if (!isUpMode && e.keyCode === 39 && this.items.length > 0) {
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
      this.selectActiveMatch();
      e.preventDefault();
      return;
    }

    if (e.srcElement) {
      this.behavior.filter(new RegExp(e.srcElement.value, 'ig'));
    }
  }

  private selectActiveMatch() {
    this.selectMatch(this.activeOption);
  }

  private selectMatch(value:SelectItem, e:Event = null) {
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
      this.element.nativeElement.querySelector('.ui-select-container').focus();
    }
  }

  private selectActive(value:SelectItem) {
    this.activeOption = value;
  }

  private isActive(value:SelectItem):boolean {
    return this.activeOption.text === value.text;
  }
}


export module Select {

  export class Behavior {
    public optionsMap:Map<string, number> = new Map<string, number>();

    constructor(public actor:Select) {
    }

    private getActiveIndex(optionsMap:Map<string, number> = null):number {
      let ai = this.actor.options.indexOf(this.actor.activeOption);

      if (ai < 0 && optionsMap !== null) {
        ai = optionsMap.get(this.actor.activeOption.id) - 1;
      }

      return ai;
    }

    public fillOptionsMap() {
      this.optionsMap.clear();
      let startPos = 0;
      this.actor.itemObjects.map(i => {
        startPos = i.fillChildrenHash(this.optionsMap, startPos);
      });
    }

    public ensureHighlightVisible(optionsMap:Map<string, number> = null) {
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
  }

  export class GenericBehavior extends Behavior implements IOptionsBehavior {
    constructor(public actor:Select) {
      super(actor);
    }

    public first() {
      this.actor.activeOption = this.actor.options[0];
      super.ensureHighlightVisible();
    }

    public last() {
      this.actor.activeOption = this.actor.options[this.actor.options.length - 1];
      super.ensureHighlightVisible();
    }

    public prev() {
      let index = this.actor.options.indexOf(this.actor.activeOption);
      this.actor.activeOption = this.actor
        .options[index - 1 < 0 ? this.actor.options.length - 1 : index - 1];
      super.ensureHighlightVisible();
    }

    public next() {
      let index = this.actor.options.indexOf(this.actor.activeOption);
      this.actor.activeOption = this.actor
        .options[index + 1 > this.actor.options.length - 1 ? 0 : index + 1];
      super.ensureHighlightVisible();
    }

    public filter(query:RegExp) {
      let options = this.actor.itemObjects
        .filter(option => query.test(option.text) &&
        (this.actor.multiple === false ||
        (this.actor.multiple === true &&
        this.actor.active.indexOf(option) < 0)));
      let isActiveAvailable = getIndex(options, this.actor.activeOption) >= 0;

      this.actor.options = options;

      if (this.actor.options.length > 0 && !isActiveAvailable) {
        this.actor.activeOption = this.actor.options[0];
      }

      super.ensureHighlightVisible();
    }
  }

  export class ChildrenBehavior extends Behavior implements IOptionsBehavior {
    constructor(public actor:Select) {
      super(actor);
    }

    public first() {
      this.actor.activeOption = this.actor.options[0].children[0];
      this.fillOptionsMap();
      this.ensureHighlightVisible(this.optionsMap);
    }

    public last() {
      this.actor.activeOption =
        this.actor
          .options[this.actor.options.length - 1]
          .children[this.actor.options[this.actor.options.length - 1].children.length - 1];
      this.fillOptionsMap();
      this.ensureHighlightVisible(this.optionsMap);
    }

    public prev() {
      let indexParent = getIndex(this.actor.options, this.actor.activeOption.parent);
      let index = getIndex(this.actor.options[indexParent].children, this.actor.activeOption);
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

    public next() {
      let indexParent = getIndex(this.actor.options, this.actor.activeOption.parent);
      let index = getIndex(this.actor.options[indexParent].children, this.actor.activeOption);
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

    public filter(query:RegExp) {
      let options:Array<SelectItem> = [];
      let optionsMap:Map<string, number> = new Map<string, number>();
      let isActiveAvailable = false;

      let startPos = 0;

      for (let si of this.actor.itemObjects) {
        let children:Array<SelectItem> = si.children.filter(option => query.test(option.text));
        startPos = si.fillChildrenHash(optionsMap, startPos);

        if (children.length > 0) {
          if (getIndex(children, this.actor.activeOption) >= 0) {
            isActiveAvailable = true;
          }

          let newSi = si.getSimilar();
          newSi.children = children;
          options.push(newSi);
        }
      }

      this.actor.options = options;

      if (this.actor.options.length > 0 && !isActiveAvailable) {
        this.actor.activeOption = this.actor.options[0];
      }

      super.ensureHighlightVisible(optionsMap);
    }
  }
}

export const select:Array<any> = [Select];
