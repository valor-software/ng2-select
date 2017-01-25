System.registerDynamic('ng2-select/components/select/select-item', [], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var SelectItem = function () {
        function SelectItem(source) {
            var _this = this;
            if (typeof source === 'string') {
                this.id = this.text = source;
            }
            if (typeof source === 'object') {
                this.id = source.id || source.text;
                this.text = source.text;
                if (source.children && source.text) {
                    this.children = source.children.map(function (c) {
                        var r = new SelectItem(c);
                        r.parent = _this;
                        return r;
                    });
                    this.text = source.text;
                }
            }
        }
        SelectItem.prototype.fillChildrenHash = function (optionsMap, startIndex) {
            var i = startIndex;
            this.children.map(function (child) {
                optionsMap.set(child.id, i++);
            });
            return i;
        };
        SelectItem.prototype.hasChildren = function () {
            return this.children && this.children.length > 0;
        };
        SelectItem.prototype.getSimilar = function () {
            var r = new SelectItem(false);
            r.id = this.id;
            r.text = this.text;
            r.parent = this.parent;
            return r;
        };
        return SelectItem;
    }();
    exports.SelectItem = SelectItem;
    return module.exports;
});
System.registerDynamic('ng2-select/components/select/select', ['@angular/core', '@angular/platform-browser', './select-item', './select-pipes', './common'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var core_1 = $__require('@angular/core');
    var platform_browser_1 = $__require('@angular/platform-browser');
    var select_item_1 = $__require('./select-item');
    var select_pipes_1 = $__require('./select-pipes');
    var common_1 = $__require('./common');
    var styles = "\n  .ui-select-toggle {\n    position: relative;\n  }\n\n  /* Fix caret going into new line in Firefox */\n  .ui-select-placeholder {\n    float: left;\n  }\n  \n  /* Fix Bootstrap dropdown position when inside a input-group */\n  .input-group > .dropdown {\n    /* Instead of relative */\n    position: static;\n  }\n  \n  .ui-select-match > .btn {\n    /* Instead of center because of .btn */\n    text-align: left !important;\n  }\n  \n  .ui-select-match > .caret {\n    position: absolute;\n    top: 45%;\n    right: 15px;\n  }\n  \n  .ui-disabled {\n    background-color: #eceeef;\n    border-radius: 4px;\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    z-index: 5;\n    opacity: 0.6;\n    top: 0;\n    left: 0;\n    cursor: not-allowed;\n  }\n  \n  .ui-select-choices {\n    width: 100%;\n    height: auto;\n    max-height: 200px;\n    overflow-x: hidden;\n    margin-top: 0;\n  }\n  \n  .ui-select-multiple .ui-select-choices {\n    margin-top: 1px;\n  }\n  .ui-select-choices-row>a {\n      display: block;\n      padding: 3px 20px;\n      clear: both;\n      font-weight: 400;\n      line-height: 1.42857143;\n      color: #333;\n      white-space: nowrap;\n  }\n  .ui-select-choices-row.active>a {\n      color: #fff;\n      text-decoration: none;\n      outline: 0;\n      background-color: #428bca;\n  }\n  \n  .ui-select-multiple {\n    height: auto;\n    padding:3px 3px 0 3px;\n  }\n  \n  .ui-select-multiple input.ui-select-search {\n    background-color: transparent !important; /* To prevent double background when disabled */\n    border: none;\n    outline: none;\n    box-shadow: none;\n    height: 1.6666em;\n    padding: 0;\n    margin-bottom: 3px;\n    \n  }\n  .ui-select-match .close {\n      font-size: 1.6em;\n      line-height: 0.75;\n  }\n  \n  .ui-select-multiple .ui-select-match-item {\n    outline: 0;\n    margin: 0 3px 3px 0;\n  }\n  .ui-select-toggle > .caret {\n      position: absolute;\n      height: 10px;\n      top: 50%;\n      right: 10px;\n      margin-top: -2px;\n  }\n";
    var SelectComponent = function () {
        function SelectComponent(element, sanitizer) {
            this.sanitizer = sanitizer;
            this.allowClear = false;
            this.placeholder = '';
            this.idField = 'id';
            this.textField = 'text';
            this.multiple = false;
            this.data = new core_1.EventEmitter();
            this.selected = new core_1.EventEmitter();
            this.removed = new core_1.EventEmitter();
            this.typed = new core_1.EventEmitter();
            this.options = [];
            this.itemObjects = [];
            this.inputMode = false;
            this.optionsOpened = false;
            this.inputValue = '';
            this._items = [];
            this._disabled = false;
            this._active = [];
            this.element = element;
            this.clickedOutside = this.clickedOutside.bind(this);
        }
        Object.defineProperty(SelectComponent.prototype, "items", {
            set: function (value) {
                if (!value) {
                    this._items = this.itemObjects = [];
                } else {
                    this._items = value.filter(function (item) {
                        // if ((typeof item === 'string' && item) || (typeof item === 'object' && item && item.text && item.id)) {
                        if (typeof item === 'string' || typeof item === 'object' && item.text) {
                            return item;
                        }
                    });
                    // this.itemObjects = this._items.map((item:any) => (typeof item === 'string' ? new SelectItem(item) : new SelectItem({id: item[this.idField], text: item[this.textField]})));
                    this.itemObjects = this._items.map(function (item) {
                        return new select_item_1.SelectItem(item);
                    });
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectComponent.prototype, "disabled", {
            get: function () {
                return this._disabled;
            },
            set: function (value) {
                this._disabled = value;
                if (this._disabled === true) {
                    this.hideOptions();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectComponent.prototype, "active", {
            get: function () {
                return this._active;
            },
            set: function (selectedItems) {
                var _this = this;
                if (!selectedItems || selectedItems.length === 0) {
                    this._active = [];
                } else {
                    var areItemsStrings_1 = typeof selectedItems[0] === 'string';
                    this._active = selectedItems.map(function (item) {
                        var data = areItemsStrings_1 ? item : { id: item[_this.idField], text: item[_this.textField] };
                        return new select_item_1.SelectItem(data);
                    });
                }
            },
            enumerable: true,
            configurable: true
        });
        SelectComponent.prototype.sanitize = function (html) {
            return this.sanitizer.bypassSecurityTrustHtml(html);
        };
        SelectComponent.prototype.inputEvent = function (e, isUpMode) {
            if (isUpMode === void 0) {
                isUpMode = false;
            }
            // tab
            if (e.keyCode === 9) {
                return;
            }
            if (isUpMode && (e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13)) {
                e.preventDefault();
                return;
            }
            // backspace
            if (!isUpMode && e.keyCode === 8) {
                var el = this.element.nativeElement.querySelector('div.ui-select-container > input');
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
            var target = e.target || e.srcElement;
            if (target && target.value) {
                this.inputValue = target.value;
                this.behavior.filter(new RegExp(common_1.escapeRegexp(this.inputValue), 'ig'));
                this.doEvent('typed', this.inputValue);
            }
        };
        SelectComponent.prototype.ngOnInit = function () {
            this.behavior = this.firstItemHasChildren ? new ChildrenBehavior(this) : new GenericBehavior(this);
        };
        SelectComponent.prototype.remove = function (item) {
            if (this._disabled === true) {
                return;
            }
            if (this.multiple === true && this.active) {
                var index = this.active.indexOf(item);
                this.active.splice(index, 1);
                this.data.next(this.active);
                this.doEvent('removed', item);
            }
            if (this.multiple === false) {
                this.active = [];
                this.data.next(this.active);
                this.doEvent('removed', item);
            }
        };
        SelectComponent.prototype.doEvent = function (type, value) {
            if (this[type] && value) {
                this[type].next(value);
            }
        };
        SelectComponent.prototype.clickedOutside = function () {
            this.inputMode = false;
            this.optionsOpened = false;
        };
        Object.defineProperty(SelectComponent.prototype, "firstItemHasChildren", {
            get: function () {
                return this.itemObjects[0] && this.itemObjects[0].hasChildren();
            },
            enumerable: true,
            configurable: true
        });
        SelectComponent.prototype.matchClick = function (e) {
            if (this._disabled === true) {
                return;
            }
            this.inputMode = !this.inputMode;
            if (this.inputMode === true && (this.multiple === true && e || this.multiple === false)) {
                this.focusToInput();
                this.open();
            }
        };
        SelectComponent.prototype.mainClick = function (event) {
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
            if (event.keyCode === 9 || event.keyCode === 13 || event.keyCode === 27 || event.keyCode >= 37 && event.keyCode <= 40) {
                event.preventDefault();
                return;
            }
            this.inputMode = true;
            var value = String.fromCharCode(96 <= event.keyCode && event.keyCode <= 105 ? event.keyCode - 48 : event.keyCode).toLowerCase();
            this.focusToInput(value);
            this.open();
            var target = event.target || event.srcElement;
            target.value = value;
            this.inputEvent(event);
        };
        SelectComponent.prototype.selectActive = function (value) {
            this.activeOption = value;
        };
        SelectComponent.prototype.isActive = function (value) {
            return this.activeOption.text === value.text;
        };
        SelectComponent.prototype.focusToInput = function (value) {
            var _this = this;
            if (value === void 0) {
                value = '';
            }
            setTimeout(function () {
                var el = _this.element.nativeElement.querySelector('div.ui-select-container > input');
                if (el) {
                    el.focus();
                    el.value = value;
                }
            }, 0);
        };
        SelectComponent.prototype.open = function () {
            var _this = this;
            this.options = this.itemObjects.filter(function (option) {
                return _this.multiple === false || _this.multiple === true && !_this.active.find(function (o) {
                    return option.text === o.text;
                });
            });
            if (this.options.length > 0) {
                this.behavior.first();
            }
            this.optionsOpened = true;
        };
        SelectComponent.prototype.hideOptions = function () {
            this.inputMode = false;
            this.optionsOpened = false;
        };
        SelectComponent.prototype.selectActiveMatch = function () {
            this.selectMatch(this.activeOption);
        };
        SelectComponent.prototype.selectMatch = function (value, e) {
            if (e === void 0) {
                e = void 0;
            }
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
                this.focusToInput(select_pipes_1.stripTags(value.text));
                this.element.nativeElement.querySelector('.ui-select-container').focus();
            }
        };
        SelectComponent.decorators = [{ type: core_1.Component, args: [{
                selector: 'ng-select',
                styles: [styles],
                template: "\n  <div tabindex=\"0\"\n     *ngIf=\"multiple === false\"\n     (keyup)=\"mainClick($event)\"\n     [offClick]=\"clickedOutside\"\n     class=\"ui-select-container dropdown open\">\n    <div [ngClass]=\"{'ui-disabled': disabled}\"></div>\n    <div class=\"ui-select-match\"\n         *ngIf=\"!inputMode\">\n      <span tabindex=\"-1\"\n          class=\"btn btn-default btn-secondary form-control ui-select-toggle\"\n          (click)=\"matchClick($event)\"\n          style=\"outline: 0;\">\n        <span *ngIf=\"active.length <= 0\" class=\"ui-select-placeholder text-muted\">{{placeholder}}</span>\n        <span *ngIf=\"active.length > 0\" class=\"ui-select-match-text pull-left\"  style=\"pointer-events:none\"\n              [ngClass]=\"{'ui-select-allow-clear': allowClear && active.length > 0}\"\n              [innerHTML]=\"sanitize(active[0].text)\"></span>\n        <i class=\"dropdown-toggle pull-right\"></i>\n        <i class=\"caret pull-right\"></i>\n        <a *ngIf=\"allowClear && active.length>0\" class=\"btn btn-xs btn-link pull-right\" style=\"margin-right: 10px; padding: 0;\" (click)=\"remove(activeOption)\">\n           <i class=\"glyphicon glyphicon-remove\"></i>\n        </a>\n      </span>\n    </div>\n    <input type=\"text\" autocomplete=\"false\" tabindex=\"-1\"\n           (keydown)=\"inputEvent($event)\"\n           (keyup)=\"inputEvent($event, true)\"\n           [disabled]=\"disabled\"\n           class=\"form-control ui-select-search\"\n           *ngIf=\"inputMode\"\n           placeholder=\"{{active.length <= 0 ? placeholder : ''}}\">\n     <!-- options template -->\n     <ul *ngIf=\"optionsOpened && options && options.length > 0 && !firstItemHasChildren\"\n          class=\"ui-select-choices dropdown-menu\" role=\"menu\">\n        <li *ngFor=\"let o of options\" role=\"menuitem\">\n          <div class=\"ui-select-choices-row\"\n               [class.active]=\"isActive(o)\"\n               (mouseenter)=\"selectActive(o)\"\n               (click)=\"selectMatch(o, $event)\">\n            <a href=\"javascript:void(0)\" class=\"dropdown-item\">\n              <div [innerHtml]=\"sanitize(o.text | highlight:inputValue)\" style=\"pointer-events:none\"></div>\n            </a>\n          </div>\n        </li>\n      </ul>\n  \n      <ul *ngIf=\"optionsOpened && options && options.length > 0 && firstItemHasChildren\"\n          class=\"ui-select-choices dropdown-menu\" role=\"menu\">\n        <li *ngFor=\"let c of options; let index=index\" role=\"menuitem\">\n          <div class=\"divider dropdown-divider\" *ngIf=\"index > 0\"></div>\n          <div class=\"dropdown-header\">{{c.text}}</div>\n  \n          <div *ngFor=\"let o of c.children\"\n               class=\"ui-select-choices-row\"\n               [class.active]=\"isActive(o)\"\n               (mouseenter)=\"selectActive(o)\"\n               (click)=\"selectMatch(o, $event)\"\n               [ngClass]=\"{'active': isActive(o)}\">\n            <a href=\"javascript:void(0)\" class=\"dropdown-item\">\n              <div [innerHtml]=\"sanitize(o.text | highlight:inputValue)\"></div>\n            </a>\n          </div>\n        </li>\n      </ul>\n  </div>\n\n  <div tabindex=\"0\"\n     *ngIf=\"multiple === true\"\n     (keyup)=\"mainClick($event)\"\n     (focus)=\"focusToInput('')\"\n     [offClick]=\"clickedOutside\"\n     class=\"ui-select-container ui-select-multiple dropdown form-control open\">\n    <div [ngClass]=\"{'ui-disabled': disabled}\"></div>\n    <span class=\"ui-select-match\">\n        <span *ngFor=\"let a of active\">\n            <span class=\"ui-select-match-item btn btn-default btn-secondary btn-xs\"\n                  tabindex=\"-1\"\n                  type=\"button\"\n                  [ngClass]=\"{'btn-default': true}\">\n               <a class=\"close\"\n                  style=\"margin-left: 5px; padding: 0;\"\n                  (click)=\"remove(a)\">&times;</a>\n               <span>{{a.text}}</span>\n           </span>\n        </span>\n    </span>\n    <input type=\"text\"\n           (keydown)=\"inputEvent($event)\"\n           (keyup)=\"inputEvent($event, true)\"\n           (click)=\"matchClick($event)\"\n           [disabled]=\"disabled\"\n           autocomplete=\"false\"\n           autocorrect=\"off\"\n           autocapitalize=\"off\"\n           spellcheck=\"false\"\n           class=\"form-control ui-select-search\"\n           placeholder=\"{{active.length <= 0 ? placeholder : ''}}\"\n           role=\"combobox\">\n     <!-- options template -->\n     <ul *ngIf=\"optionsOpened && options && options.length > 0 && !firstItemHasChildren\"\n          class=\"ui-select-choices dropdown-menu\" role=\"menu\">\n        <li *ngFor=\"let o of options\" role=\"menuitem\">\n          <div class=\"ui-select-choices-row\"\n               [class.active]=\"isActive(o)\"\n               (mouseenter)=\"selectActive(o)\"\n               (click)=\"selectMatch(o, $event)\">\n            <a href=\"javascript:void(0)\" class=\"dropdown-item\">\n              <div [innerHtml]=\"sanitize(o.text | highlight:inputValue)\"></div>\n            </a>\n          </div>\n        </li>\n      </ul>\n  \n      <ul *ngIf=\"optionsOpened && options && options.length > 0 && firstItemHasChildren\"\n          class=\"ui-select-choices dropdown-menu\" role=\"menu\">\n        <li *ngFor=\"let c of options; let index=index\" role=\"menuitem\">\n          <div class=\"divider dropdown-divider\" *ngIf=\"index > 0\"></div>\n          <div class=\"dropdown-header\">{{c.text}}</div>\n  \n          <div *ngFor=\"let o of c.children\"\n               class=\"ui-select-choices-row\"\n               [class.active]=\"isActive(o)\"\n               (mouseenter)=\"selectActive(o)\"\n               (click)=\"selectMatch(o, $event)\"\n               [ngClass]=\"{'active': isActive(o)}\">\n            <a href=\"javascript:void(0)\" class=\"dropdown-item\">\n              <div [innerHtml]=\"sanitize(o.text | highlight:inputValue)\"></div>\n            </a>\n          </div>\n        </li>\n      </ul>\n  </div>\n  "
            }] }];
        /** @nocollapse */
        SelectComponent.ctorParameters = [{ type: core_1.ElementRef }, { type: platform_browser_1.DomSanitizer }];
        SelectComponent.propDecorators = {
            'allowClear': [{ type: core_1.Input }],
            'placeholder': [{ type: core_1.Input }],
            'idField': [{ type: core_1.Input }],
            'textField': [{ type: core_1.Input }],
            'multiple': [{ type: core_1.Input }],
            'items': [{ type: core_1.Input }],
            'disabled': [{ type: core_1.Input }],
            'active': [{ type: core_1.Input }],
            'data': [{ type: core_1.Output }],
            'selected': [{ type: core_1.Output }],
            'removed': [{ type: core_1.Output }],
            'typed': [{ type: core_1.Output }]
        };
        return SelectComponent;
    }();
    exports.SelectComponent = SelectComponent;
    var Behavior = function () {
        function Behavior(actor) {
            this.optionsMap = new Map();
            this.actor = actor;
        }
        Behavior.prototype.fillOptionsMap = function () {
            var _this = this;
            this.optionsMap.clear();
            var startPos = 0;
            this.actor.itemObjects.map(function (item) {
                startPos = item.fillChildrenHash(_this.optionsMap, startPos);
            });
        };
        Behavior.prototype.ensureHighlightVisible = function (optionsMap) {
            if (optionsMap === void 0) {
                optionsMap = void 0;
            }
            var container = this.actor.element.nativeElement.querySelector('.ui-select-choices-content');
            if (!container) {
                return;
            }
            var choices = container.querySelectorAll('.ui-select-choices-row');
            if (choices.length < 1) {
                return;
            }
            var activeIndex = this.getActiveIndex(optionsMap);
            if (activeIndex < 0) {
                return;
            }
            var highlighted = choices[activeIndex];
            if (!highlighted) {
                return;
            }
            var posY = highlighted.offsetTop + highlighted.clientHeight - container.scrollTop;
            var height = container.offsetHeight;
            if (posY > height) {
                container.scrollTop += posY - height;
            } else if (posY < highlighted.clientHeight) {
                container.scrollTop -= highlighted.clientHeight - posY;
            }
        };
        Behavior.prototype.getActiveIndex = function (optionsMap) {
            if (optionsMap === void 0) {
                optionsMap = void 0;
            }
            var ai = this.actor.options.indexOf(this.actor.activeOption);
            if (ai < 0 && optionsMap !== void 0) {
                ai = optionsMap.get(this.actor.activeOption.id);
            }
            return ai;
        };
        return Behavior;
    }();
    exports.Behavior = Behavior;
    var GenericBehavior = function (_super) {
        __extends(GenericBehavior, _super);
        function GenericBehavior(actor) {
            _super.call(this, actor);
        }
        GenericBehavior.prototype.first = function () {
            this.actor.activeOption = this.actor.options[0];
            _super.prototype.ensureHighlightVisible.call(this);
        };
        GenericBehavior.prototype.last = function () {
            this.actor.activeOption = this.actor.options[this.actor.options.length - 1];
            _super.prototype.ensureHighlightVisible.call(this);
        };
        GenericBehavior.prototype.prev = function () {
            var index = this.actor.options.indexOf(this.actor.activeOption);
            this.actor.activeOption = this.actor.options[index - 1 < 0 ? this.actor.options.length - 1 : index - 1];
            _super.prototype.ensureHighlightVisible.call(this);
        };
        GenericBehavior.prototype.next = function () {
            var index = this.actor.options.indexOf(this.actor.activeOption);
            this.actor.activeOption = this.actor.options[index + 1 > this.actor.options.length - 1 ? 0 : index + 1];
            _super.prototype.ensureHighlightVisible.call(this);
        };
        GenericBehavior.prototype.filter = function (query) {
            var _this = this;
            var options = this.actor.itemObjects.filter(function (option) {
                return select_pipes_1.stripTags(option.text).match(query) && (_this.actor.multiple === false || _this.actor.multiple === true && _this.actor.active.map(function (item) {
                    return item.id;
                }).indexOf(option.id) < 0);
            });
            this.actor.options = options;
            if (this.actor.options.length > 0) {
                this.actor.activeOption = this.actor.options[0];
                _super.prototype.ensureHighlightVisible.call(this);
            }
        };
        return GenericBehavior;
    }(Behavior);
    exports.GenericBehavior = GenericBehavior;
    var ChildrenBehavior = function (_super) {
        __extends(ChildrenBehavior, _super);
        function ChildrenBehavior(actor) {
            _super.call(this, actor);
        }
        ChildrenBehavior.prototype.first = function () {
            this.actor.activeOption = this.actor.options[0].children[0];
            this.fillOptionsMap();
            this.ensureHighlightVisible(this.optionsMap);
        };
        ChildrenBehavior.prototype.last = function () {
            this.actor.activeOption = this.actor.options[this.actor.options.length - 1].children[this.actor.options[this.actor.options.length - 1].children.length - 1];
            this.fillOptionsMap();
            this.ensureHighlightVisible(this.optionsMap);
        };
        ChildrenBehavior.prototype.prev = function () {
            var _this = this;
            var indexParent = this.actor.options.findIndex(function (option) {
                return _this.actor.activeOption.parent && _this.actor.activeOption.parent.id === option.id;
            });
            var index = this.actor.options[indexParent].children.findIndex(function (option) {
                return _this.actor.activeOption && _this.actor.activeOption.id === option.id;
            });
            this.actor.activeOption = this.actor.options[indexParent].children[index - 1];
            if (!this.actor.activeOption) {
                if (this.actor.options[indexParent - 1]) {
                    this.actor.activeOption = this.actor.options[indexParent - 1].children[this.actor.options[indexParent - 1].children.length - 1];
                }
            }
            if (!this.actor.activeOption) {
                this.last();
            }
            this.fillOptionsMap();
            this.ensureHighlightVisible(this.optionsMap);
        };
        ChildrenBehavior.prototype.next = function () {
            var _this = this;
            var indexParent = this.actor.options.findIndex(function (option) {
                return _this.actor.activeOption.parent && _this.actor.activeOption.parent.id === option.id;
            });
            var index = this.actor.options[indexParent].children.findIndex(function (option) {
                return _this.actor.activeOption && _this.actor.activeOption.id === option.id;
            });
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
        };
        ChildrenBehavior.prototype.filter = function (query) {
            var options = [];
            var optionsMap = new Map();
            var startPos = 0;
            for (var _i = 0, _a = this.actor.itemObjects; _i < _a.length; _i++) {
                var si = _a[_i];
                var children = si.children.filter(function (option) {
                    return query.test(option.text);
                });
                startPos = si.fillChildrenHash(optionsMap, startPos);
                if (children.length > 0) {
                    var newSi = si.getSimilar();
                    newSi.children = children;
                    options.push(newSi);
                }
            }
            this.actor.options = options;
            if (this.actor.options.length > 0) {
                this.actor.activeOption = this.actor.options[0].children[0];
                _super.prototype.ensureHighlightVisible.call(this, optionsMap);
            }
        };
        return ChildrenBehavior;
    }(Behavior);
    exports.ChildrenBehavior = ChildrenBehavior;
    return module.exports;
});
System.registerDynamic("ng2-select/components/select/common", [], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    function escapeRegexp(queryToEscape) {
        return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }
    exports.escapeRegexp = escapeRegexp;
    return module.exports;
});
System.registerDynamic('ng2-select/components/select/select-pipes', ['@angular/core', './common'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var core_1 = $__require('@angular/core');
    var common_1 = $__require('./common');
    var HighlightPipe = function () {
        function HighlightPipe() {}
        HighlightPipe.prototype.transform = function (value, query) {
            if (query.length < 1) {
                return value;
            }
            if (query) {
                var tagRE = new RegExp('<[^<>]*>', 'ig');
                // get ist of tags
                var tagList = value.match(tagRE);
                // Replace tags with token
                var tmpValue = value.replace(tagRE, '$!$');
                // Replace search words
                value = tmpValue.replace(new RegExp(common_1.escapeRegexp(query), 'gi'), '<strong>$&</strong>');
                // Reinsert HTML
                for (var i = 0; value.indexOf('$!$') > -1; i++) {
                    value = value.replace('$!$', tagList[i]);
                }
            }
            return value;
        };
        HighlightPipe.decorators = [{ type: core_1.Pipe, args: [{ name: 'highlight' }] }];
        /** @nocollapse */
        HighlightPipe.ctorParameters = [];
        return HighlightPipe;
    }();
    exports.HighlightPipe = HighlightPipe;
    function stripTags(input) {
        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
        var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
        return input.replace(commentsAndPhpTags, '').replace(tags, '');
    }
    exports.stripTags = stripTags;
    return module.exports;
});
System.registerDynamic('ng2-select/components/select/off-click', ['@angular/core'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var core_1 = $__require('@angular/core');
    var OffClickDirective = function () {
        function OffClickDirective() {}
        /* tslint:enable */
        OffClickDirective.prototype.onClick = function ($event) {
            $event.stopPropagation();
        };
        OffClickDirective.prototype.ngOnInit = function () {
            var _this = this;
            setTimeout(function () {
                document.addEventListener('click', _this.offClickHandler);
            }, 0);
        };
        OffClickDirective.prototype.ngOnDestroy = function () {
            document.removeEventListener('click', this.offClickHandler);
        };
        OffClickDirective.decorators = [{ type: core_1.Directive, args: [{
                selector: '[offClick]'
            }] }];
        /** @nocollapse */
        OffClickDirective.ctorParameters = [];
        OffClickDirective.propDecorators = {
            'offClickHandler': [{ type: core_1.Input, args: ['offClick'] }],
            'onClick': [{ type: core_1.HostListener, args: ['click', ['$event']] }]
        };
        return OffClickDirective;
    }();
    exports.OffClickDirective = OffClickDirective;
    return module.exports;
});
System.registerDynamic('ng2-select/components/select.module', ['@angular/core', '@angular/common', './select/select', './select/select-pipes', './select/off-click'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var core_1 = $__require('@angular/core');
    var common_1 = $__require('@angular/common');
    var select_1 = $__require('./select/select');
    var select_pipes_1 = $__require('./select/select-pipes');
    var off_click_1 = $__require('./select/off-click');
    var SelectModule = function () {
        function SelectModule() {}
        SelectModule.decorators = [{ type: core_1.NgModule, args: [{
                imports: [common_1.CommonModule],
                declarations: [select_1.SelectComponent, select_pipes_1.HighlightPipe, off_click_1.OffClickDirective],
                exports: [select_1.SelectComponent, select_pipes_1.HighlightPipe, off_click_1.OffClickDirective]
            }] }];
        /** @nocollapse */
        SelectModule.ctorParameters = [];
        return SelectModule;
    }();
    exports.SelectModule = SelectModule;
    return module.exports;
});
System.registerDynamic('ng2-select/ng2-select', ['./components/select/select', './components/select.module'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export($__require('./components/select/select'));
    var select_module_1 = $__require('./components/select.module');
    exports.SelectModule = select_module_1.SelectModule;
    return module.exports;
});
//# sourceMappingURL=ng2-select.js.map