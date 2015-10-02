webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(46);


/***/ },

/***/ 46:
/***/ function(module, exports, __webpack_require__) {

	///<reference path="../tsd.d.ts"/>
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(85));
	__export(__webpack_require__(83));
	//# sourceMappingURL=index.js.map

/***/ },

/***/ 82:
/***/ function(module, exports) {

	module.exports = "\n/* Style when highlighting a search. */\n.ui-select-highlight {\n  font-weight: bold;\n}\n\n.ui-select-offscreen {\n  clip: rect(0 0 0 0) !important;\n  width: 1px !important;\n  height: 1px !important;\n  border: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  overflow: hidden !important;\n  position: absolute !important;\n  outline: 0 !important;\n  left: 0px !important;\n  top: 0px !important;\n}\n\n\n.ui-select-choices-row:hover {\n  background-color: #f5f5f5;\n}\n\n/* Select2 theme */\n\n/* Mark invalid Select2 */\n.ng-dirty.ng-invalid > a.select2-choice {\n    border-color: #D44950;\n}\n\n.select2-result-single {\n  padding-left: 0;\n}\n\n.select2-locked > .select2-search-choice-close{\n  display:none;\n}\n\n.select-locked > .ui-select-match-close{\n    display:none;\n}\n\nbody > .select2-container.open {\n  z-index: 9999; /* The z-index Select2 applies to the select2-drop */\n}\n\n/* Handle up direction Select2 */\n.ui-select-container[theme=\"select2\"].direction-up .ui-select-match {\n    border-radius: 4px; /* FIXME hardcoded value :-/ */\n    border-top-left-radius: 0;\n    border-top-right-radius: 0;\n}\n.ui-select-container[theme=\"select2\"].direction-up .ui-select-dropdown {\n    border-radius: 4px; /* FIXME hardcoded value :-/ */\n    border-bottom-left-radius: 0;\n    border-bottom-right-radius: 0;\n\n    border-top-width: 1px;  /* FIXME hardcoded value :-/ */\n    border-top-style: solid;\n\n    box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.25);\n\n    margin-top: -4px; /* FIXME hardcoded value :-/ */\n}\n.ui-select-container[theme=\"select2\"].direction-up .ui-select-dropdown .select2-search {\n    margin-top: 4px; /* FIXME hardcoded value :-/ */\n}\n.ui-select-container[theme=\"select2\"].direction-up.select2-dropdown-open .ui-select-match {\n    border-bottom-color: #5897fb;\n}\n\n/* Selectize theme */\n\n/* Helper class to show styles when focus */\n.selectize-input.selectize-focus{\n  border-color: #007FBB !important;\n}\n\n/* Fix input width for Selectize theme */\n.selectize-control > .selectize-input > input {\n  width: 100%;\n}\n\n/* Fix dropdown width for Selectize theme */\n.selectize-control > .selectize-dropdown {\n  width: 100%;\n}\n\n/* Mark invalid Selectize */\n.ng-dirty.ng-invalid > div.selectize-input {\n    border-color: #D44950;\n}\n\n/* Handle up direction Selectize */\n.ui-select-container[theme=\"selectize\"].direction-up .ui-select-dropdown {\n    box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.25);\n\n    margin-top: -2px; /* FIXME hardcoded value :-/ */\n}\n\n/* Bootstrap theme */\n\n/* Helper class to show styles when focus */\n.btn-default-focus {\n  color: #333;\n  background-color: #EBEBEB;\n  border-color: #ADADAD;\n  text-decoration: none;\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);\n}\n\n.ui-select-bootstrap .ui-select-toggle {\n  position: relative;\n}\n\n.ui-select-bootstrap .ui-select-toggle > .caret {\n  position: absolute;\n  height: 10px;\n  top: 50%;\n  right: 10px;\n  margin-top: -2px;\n}\n\n/* Fix Bootstrap dropdown position when inside a input-group */\n.input-group > .ui-select-bootstrap.dropdown {\n  /* Instead of relative */\n  position: static;\n}\n\n.input-group > .ui-select-bootstrap > input.ui-select-search.form-control {\n  border-radius: 4px; /* FIXME hardcoded value :-/ */\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.input-group > .ui-select-bootstrap > input.ui-select-search.form-control.direction-up {\n  border-radius: 4px !important; /* FIXME hardcoded value :-/ */\n  border-top-right-radius: 0 !important;\n  border-bottom-right-radius: 0 !important;\n}\n\n.ui-select-bootstrap > .ui-select-match > .btn{\n  /* Instead of center because of .btn */\n  text-align: left !important;\n}\n\n.ui-select-bootstrap > .ui-select-match > .caret {\n  position: absolute;\n  top: 45%;\n  right: 15px;\n}\n\n/* See Scrollable Menu with Bootstrap 3 http://stackoverflow.com/questions/19227496 */\n.ui-select-bootstrap > .ui-select-choices {\n  width: 100%;\n  height: auto;\n  max-height: 200px;\n  overflow-x: hidden;\n  margin-top: -1px;\n}\n\nbody > .ui-select-bootstrap.open {\n  z-index: 1000; /* Standard Bootstrap dropdown z-index */\n}\n\n.ui-select-multiple.ui-select-bootstrap {\n  height: auto;\n  padding: 3px 3px 0 3px;\n}\n\n.ui-select-multiple.ui-select-bootstrap input.ui-select-search {\n  background-color: transparent !important; /* To prevent double background when disabled */\n  border: none;\n  outline: none;\n  height: 1.666666em;\n  margin-bottom: 3px;\n}\n\n.ui-select-multiple.ui-select-bootstrap .ui-select-match .close {\n  font-size: 1.6em;\n  line-height: 0.75;\n}\n\n.ui-select-multiple.ui-select-bootstrap .ui-select-match-item {\n  outline: 0;\n  margin: 0 3px 3px 0;\n}\n\n.ui-select-multiple .ui-select-match-item {\n  position: relative;\n}\n\n.ui-select-multiple .ui-select-match-item.dropping-before:before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  right: 100%;\n  height: 100%;\n  margin-right: 2px;\n  border-left: 1px solid #428bca;\n}\n\n.ui-select-multiple .ui-select-match-item.dropping-after:after {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 100%;\n  height: 100%;\n  margin-left: 2px;\n  border-right: 1px solid #428bca;\n}\n\n.ui-select-bootstrap .ui-select-choices-row>a {\n    display: block;\n    padding: 3px 20px;\n    clear: both;\n    font-weight: 400;\n    line-height: 1.42857143;\n    color: #333;\n    white-space: nowrap;\n}\n\n.ui-select-bootstrap .ui-select-choices-row>a:hover, .ui-select-bootstrap .ui-select-choices-row>a:focus {\n    text-decoration: none;\n    color: #262626;\n    background-color: #f5f5f5;\n}\n\n.ui-select-bootstrap .ui-select-choices-row.active>a {\n    color: #fff;\n    text-decoration: none;\n    outline: 0;\n    background-color: #428bca;\n}\n\n.ui-select-bootstrap .ui-select-choices-row.disabled>a,\n.ui-select-bootstrap .ui-select-choices-row.active.disabled>a {\n    color: #777;\n    cursor: not-allowed;\n    background-color: #fff;\n}\n\n/* fix hide/show angular animation */\n.ui-select-match.ng-hide-add,\n.ui-select-search.ng-hide-add {\n    display: none !important;\n}\n\n/* Mark invalid Bootstrap */\n.ui-select-bootstrap.ng-dirty.ng-invalid > button.btn.ui-select-match {\n    border-color: #D44950;\n}\n\n/* Handle up direction Bootstrap */\n.ui-select-container[theme=\"bootstrap\"].direction-up .ui-select-dropdown {\n    box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.25);\n}\n"

/***/ },

/***/ 83:
/***/ function(module, exports) {

	(function (Ng2SelectTheme) {
	    Ng2SelectTheme[Ng2SelectTheme["BS3"] = 1] = "BS3";
	    Ng2SelectTheme[Ng2SelectTheme["BS4"] = 2] = "BS4";
	})(exports.Ng2SelectTheme || (exports.Ng2SelectTheme = {}));
	var Ng2SelectTheme = exports.Ng2SelectTheme;
	var Ng2SelectConfig = (function () {
	    function Ng2SelectConfig() {
	    }
	    Object.defineProperty(Ng2SelectConfig, "theme", {
	        get: function () {
	            var w = window;
	            if (w && w.__theme === 'bs4') {
	                return Ng2SelectTheme.BS4;
	            }
	            return (this._theme || Ng2SelectTheme.BS3);
	        },
	        set: function (v) {
	            this._theme = v;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Ng2SelectConfig;
	})();
	exports.Ng2SelectConfig = Ng2SelectConfig;
	//# sourceMappingURL=ng2-select-config.js.map

/***/ },

/***/ 84:
/***/ function(module, exports) {

	var SelectItem = (function () {
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
	            if (source.submenu) {
	                this.subMenu = new SelectSubMenu(source.submenu, this);
	            }
	        }
	    }
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
	})();
	exports.SelectItem = SelectItem;
	//# sourceMappingURL=select-item.js.map

/***/ },

/***/ 85:
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../tsd.d.ts" />
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
	    switch (arguments.length) {
	        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
	        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
	        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
	    }
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var angular2_1 = __webpack_require__(5);
	var select_item_1 = __webpack_require__(84);
	var cssCommon = __webpack_require__(82);
	function getIndex(a, v) {
	    for (var i = 0; i < a.length; i++) {
	        if (a[i].id === v.id) {
	            return i;
	        }
	    }
	    return -1;
	}
	var Select = (function () {
	    function Select(element) {
	        this.element = element;
	        this.data = new angular2_1.EventEmitter();
	        this.multiple = false;
	        this.selected = new angular2_1.EventEmitter();
	        this.removed = new angular2_1.EventEmitter();
	        this.allowClear = false;
	        this.placeholder = '';
	        this.initData = [];
	        this._items = [];
	        this.options = [];
	        this.itemObjects = [];
	        this.active = [];
	        this.showSearchInputInDropdown = true;
	        this.inputMode = false;
	        this.optionsOpened = false;
	    }
	    Select.prototype.focusToInput = function (value) {
	        var _this = this;
	        if (value === void 0) { value = ''; }
	        setTimeout(function () {
	            var el = _this.element.nativeElement.querySelector('div.ui-select-container > input');
	            el.focus();
	            el.value = value;
	        }, 0);
	    };
	    Select.prototype.f = function () {
	        this.inputMode = !this.inputMode;
	        if (this.inputMode === true) {
	            this.focusToInput();
	            this.open();
	        }
	    };
	    Select.prototype.ff = function (e) {
	        if (this.inputMode === true) {
	            return;
	        }
	        if (e.keyCode === 46) {
	            e.preventDefault();
	            this.inputEvent(e);
	            return;
	        }
	        if (e.keyCode === 9 || e.keyCode === 8 || e.keyCode === 13 ||
	            e.keyCode === 27 || (e.keyCode >= 37 && e.keyCode <= 40)) {
	            e.preventDefault();
	            return;
	        }
	        this.inputMode = true;
	        var value = String
	            .fromCharCode(96 <= e.keyCode && e.keyCode <= 105 ? e.keyCode - 48 : e.keyCode)
	            .toLowerCase();
	        this.focusToInput(value);
	        this.open();
	        e.srcElement.value = value;
	        this.inputEvent(e);
	    };
	    Select.prototype.open = function () {
	        var _this = this;
	        this.options = this.itemObjects
	            .filter(function (option) { return (_this.multiple === false ||
	            _this.multiple === true && !_this.active.find(function (o) { return option.text === o.text; })); });
	        if (this.options.length > 0) {
	            this.activeOption = this.options[0];
	        }
	        this.optionsOpened = true;
	    };
	    Object.defineProperty(Select.prototype, "items", {
	        get: function () {
	            return this._items;
	        },
	        set: function (value) {
	            this._items = value;
	            this.itemObjects = this._items.map(function (item) { return new select_item_1.SelectItem(item); });
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Select.prototype.onInit = function () {
	        this.offSideClickHandler = this.getOffSideClickHandler(this);
	        document.addEventListener('click', this.offSideClickHandler);
	        if (this.initData) {
	            this.active = this.initData.map(function (d) { return new select_item_1.SelectItem(d); });
	            this.data.next(this.active);
	        }
	    };
	    Select.prototype.onDestroy = function () {
	        document.removeEventListener('click', this.offSideClickHandler);
	        this.offSideClickHandler = null;
	    };
	    Select.prototype.getOffSideClickHandler = function (context) {
	        return function (e) {
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
	    };
	    Select.prototype.remove = function (item) {
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
	    Select.prototype.doEvent = function (type, value) {
	        if (this[type] && value) {
	            this[type].next(value);
	        }
	    };
	    Select.prototype._getActiveIndex = function () {
	        return this.options.indexOf(this.activeOption);
	    };
	    Select.prototype._ensureHighlightVisible = function () {
	        var container = this.element.nativeElement.children[0].querySelector('.ui-select-choices-content');
	        if (!container) {
	            return;
	        }
	        var choices = container.querySelectorAll('.ui-select-choices-row');
	        if (choices.length < 1) {
	            return;
	        }
	        if (this._getActiveIndex() < 0) {
	            return;
	        }
	        var highlighted = choices[this._getActiveIndex()];
	        if (!highlighted) {
	            return;
	        }
	        var posY = highlighted.offsetTop + highlighted.clientHeight - container.scrollTop;
	        var height = container.offsetHeight;
	        if (posY > height) {
	            container.scrollTop += posY - height;
	        }
	        else if (posY < highlighted.clientHeight) {
	            container.scrollTop -= highlighted.clientHeight - posY;
	        }
	    };
	    Select.prototype.hideOptions = function () {
	        this.inputMode = false;
	        this.optionsOpened = false;
	    };
	    Select.prototype.inputEvent = function (e, isUpMode) {
	        if (isUpMode === void 0) { isUpMode = false; }
	        if (!isUpMode && (e.keyCode === 27 || e.keyCode === 9)) {
	            this.hideOptions();
	            this.element.nativeElement.children[0].focus();
	            e.preventDefault();
	            return;
	        }
	        if (!isUpMode && e.keyCode === 46) {
	            if (this.active.length > 0) {
	                this.remove(this.active[this.active.length - 1]);
	            }
	            e.preventDefault();
	        }
	        if (!isUpMode && e.keyCode === 37 && this.items.length > 0) {
	            this.activeOption = this.options[0];
	            this._ensureHighlightVisible();
	            e.preventDefault();
	            return;
	        }
	        if (!isUpMode && e.keyCode === 39 && this.items.length > 0) {
	            this.activeOption = this.options[this.options.length - 1];
	            this._ensureHighlightVisible();
	            e.preventDefault();
	            return;
	        }
	        if (!isUpMode && e.keyCode === 38) {
	            var index = this.options.indexOf(this.activeOption);
	            this.activeOption = this.options[index - 1 < 0 ? this.options.length - 1 : index - 1];
	            this._ensureHighlightVisible();
	            e.preventDefault();
	            return;
	        }
	        if (!isUpMode && e.keyCode === 40) {
	            var index = this.options.indexOf(this.activeOption);
	            this.activeOption = this.options[index + 1 > this.options.length - 1 ? 0 : index + 1];
	            this._ensureHighlightVisible();
	            e.preventDefault();
	            return;
	        }
	        if (!isUpMode && e.keyCode === 13) {
	            this.selectActiveMatch();
	            e.preventDefault();
	            return;
	        }
	        if (e.srcElement) {
	            var query = new RegExp(e.srcElement.value, 'ig');
	            var _a = this.filter(query), options = _a.options, isActiveAvailable = _a.isActiveAvailable;
	            this.options = options;
	            if (this.options.length > 0 && !isActiveAvailable) {
	                this.activeOption = this.options[0];
	            }
	            this._ensureHighlightVisible();
	        }
	    };
	    Select.prototype.filter = function (query) {
	        var _this = this;
	        var options = this.itemObjects
	            .filter(function (option) { return query.test(option.text) &&
	            (_this.multiple === false ||
	                (_this.multiple === true &&
	                    _this.active.indexOf(option) < 0)); });
	        var isActiveAvailable = getIndex(options, this.activeOption) >= 0;
	        return { options: options, isActiveAvailable: isActiveAvailable };
	    };
	    Select.prototype.selectActiveMatch = function () {
	        this.selectMatch(this.activeOption);
	    };
	    Select.prototype.selectMatch = function (value, e) {
	        if (e === void 0) { e = null; }
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
	        this.element.nativeElement.children[0].focus();
	    };
	    Select.prototype.selectActive = function (value) {
	        this.activeOption = value;
	    };
	    Select.prototype.isActive = function (value) {
	        return this.activeOption.text === value.text;
	    };
	    Select.prototype.hasSearchInput = function () {
	        if (this.multiple === true) {
	            return false;
	        }
	        return this.showSearchInputInDropdown;
	    };
	    Select = __decorate([
	        angular2_1.Component({
	            selector: 'ng2-select',
	            properties: [
	                'allowClear',
	                'placeholder',
	                'initData:data',
	                'items',
	                'multiple',
	                'showSearchInputInDropdown'],
	            events: ['selected', 'removed', 'data']
	        }),
	        angular2_1.View({
	            template: "\n  <div tabindex=\"0\" (keyup)=\"ff($event)\" class=\"ui-select-container ui-select-bootstrap dropdown open\">\n    <div class=\"ui-select-match\" *ng-if=\"!inputMode\" class=\"btn-default-focus\">\n      <span tabindex=\"-1\"\n          class=\"btn btn-default form-control ui-select-toggle\"\n          (^click)=\"f()\"\n          style=\"outline: 0;\">\n        <span *ng-if=\"active.length <= 0\" class=\"ui-select-placeholder text-muted\">{{placeholder}}</span>\n        <span *ng-if=\"active.length > 0\" class=\"ui-select-match-text pull-left\"\n              [ng-class]=\"{'ui-select-allow-clear': allowClear && active.length > 0}\">{{active[0].text}}</span>\n        <i class=\"caret pull-right\" ng-click=\"$select.toggle($event)\"></i>\n        <a *ng-if=\"allowClear && active.length>0\" style=\"margin-right: 10px\"\n          (click)=\"remove(activeOption)\" class=\"btn btn-xs btn-link pull-right\">\n          <i class=\"glyphicon glyphicon-remove\"></i>\n        </a>\n      </span>\n    </div>\n    <input type=\"text\" autocomplete=\"false\" tabindex=\"-1\"\n           (keydown)=\"inputEvent($event)\"\n           (keyup)=\"inputEvent($event, true)\"\n           class=\"form-control ui-select-search\"\n           *ng-if=\"inputMode\"\n           placeholder=\"{{active.length <= 0 ? placeholder : ''}}\">\n    <ul *ng-if=\"optionsOpened && options && options.length > 0\"\n        class=\"ui-select-choices ui-select-choices-content ui-select-dropdown dropdown-menu\">\n      <li class=\"ui-select-choices-group\">\n        <div *ng-for=\"#o of options\"\n             class=\"ui-select-choices-row\"\n             (mouseenter)=\"selectActive(o)\"\n             (click)=\"selectMatch(o, $event)\"\n             [ng-class]=\"{'active': isActive(o)}\">\n          <a href=\"javascript:void(0)\" class=\"ui-select-choices-row-inner\">\n            <div>{{o.text}}</div>\n          </a>\n        </div>\n      </li>\n    </ul>\n  </div>\n  ",
	            styles: [cssCommon],
	            directives: [angular2_1.CORE_DIRECTIVES, angular2_1.FORM_DIRECTIVES]
	        }), 
	        __metadata('design:paramtypes', [angular2_1.ElementRef])
	    ], Select);
	    return Select;
	})();
	exports.Select = Select;
	exports.select = [Select];
	//# sourceMappingURL=select.js.map

/***/ }

});
//# sourceMappingURL=angular2-select.js.map