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
    <ul *ng-if="optionsOpened && options && options.length > 0"
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
    <ul *ng-if="optionsOpened && options && options.length > 0"
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
</div>
  `,
  styles: [cssCommon],
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class Select implements OnInit, OnDestroy {
  private data:EventEmitter = new EventEmitter();
  private multiple:boolean = false;
  private selected:EventEmitter = new EventEmitter();
  private removed:EventEmitter = new EventEmitter();
  private allowClear:boolean = false;
  private placeholder:string = '';
  private initData:Array<any> = [];
  private _items:Array<any> = [];
  private options:Array<SelectItem> = [];
  private itemObjects:Array<SelectItem> = [];
  private active:Array<SelectItem> = [];
  private activeOption:SelectItem;
  private offSideClickHandler:any;
  private inputMode:boolean = false;
  private optionsOpened:boolean = false;

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
      this.activeOption = this.options[0];
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

  private _getActiveIndex():number {
    return this.options.indexOf(this.activeOption);
  }

  private _ensureHighlightVisible() {
    let container = this.element.nativeElement.children[0].querySelector('.ui-select-choices-content');
    if (!container) {
      return;
    }

    let choices = container.querySelectorAll('.ui-select-choices-row');
    if (choices.length < 1) {
      return;
    }

    if (this._getActiveIndex() < 0) {
      return;
    }

    let highlighted:any = choices[this._getActiveIndex()];
    if (!highlighted) {
      return;
    }

    let posY:number = highlighted.offsetTop + highlighted.clientHeight - container.scrollTop;
    let height:number = container.offsetHeight;

    if (posY > height) {
      container.scrollTop += posY - height;
    } else if (posY < highlighted.clientHeight) {
      // if (ctrl.isGrouped && ctrl.activeIndex === 0)
      //  container[0].scrollTop = 0; //To make group header visible when going all the way up
      // else
      container.scrollTop -= highlighted.clientHeight - posY;
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
      this.activeOption = this.options[0];
      this._ensureHighlightVisible();
      e.preventDefault();
      return;
    }

    // right
    if (!isUpMode && e.keyCode === 39 && this.items.length > 0) {
      this.activeOption = this.options[this.options.length - 1];
      this._ensureHighlightVisible();
      e.preventDefault();
      return;
    }

    // up
    if (!isUpMode && e.keyCode === 38) {
      let index = this.options.indexOf(this.activeOption);
      this.activeOption = this.options[index - 1 < 0 ? this.options.length - 1 : index - 1];
      this._ensureHighlightVisible();
      e.preventDefault();
      return;
    }

    // down
    if (!isUpMode && e.keyCode === 40) {
      let index = this.options.indexOf(this.activeOption);
      this.activeOption = this.options[index + 1 > this.options.length - 1 ? 0 : index + 1];
      this._ensureHighlightVisible();
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
      let query:RegExp = new RegExp(e.srcElement.value, 'ig');
      let {options, isActiveAvailable} = this.filter(query);
      this.options = options;

      if (this.options.length > 0 && !isActiveAvailable) {
        this.activeOption = this.options[0];
      }

      this._ensureHighlightVisible();
    }
  }

  private filter(query:RegExp):any {
    let options = this.itemObjects
      .filter(option => query.test(option.text) &&
      (this.multiple === false ||
      (this.multiple === true &&
      this.active.indexOf(option) < 0)));
    let isActiveAvailable = getIndex(options, this.activeOption) >= 0;
    return {options, isActiveAvailable};
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

export const select:Array<any> = [Select];
