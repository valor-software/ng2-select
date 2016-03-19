import { EventEmitter, ElementRef } from 'angular2/core';
import { SelectItem } from './select-item';
import { IOptionsBehavior } from './select-interfaces';
export declare class Select {
    element: ElementRef;
    allowClear: boolean;
    placeholder: string;
    initData: Array<any>;
    multiple: boolean;
    tagging: boolean;
    taggingTokens: string[];
    items: Array<any>;
    disabled: boolean;
    data: EventEmitter<any>;
    selected: EventEmitter<any>;
    removed: EventEmitter<any>;
    typed: EventEmitter<any>;
    options: Array<SelectItem>;
    itemObjects: Array<SelectItem>;
    active: Array<SelectItem>;
    activeOption: SelectItem;
    private offSideClickHandler;
    private inputMode;
    private optionsOpened;
    private behavior;
    private inputValue;
    private _initData;
    private _items;
    private _disabled;
    private static KEYMAP;
    constructor(element: ElementRef);
    private focusToInput(value?);
    private matchClick(e);
    private mainClick(e);
    private open();
    ngOnInit(): void;
    ngOnDestroy(): void;
    private getOffSideClickHandler(context);
    remove(item: SelectItem): void;
    doEvent(type: string, value: any): void;
    private hideOptions();
    inputEvent(e: any, isUpMode?: boolean): void;
    private selectActiveMatch();
    private selectMatch(value, e?);
    private selectActive(value);
    private isActive(value);
}
export declare class Behavior {
    actor: Select;
    optionsMap: Map<string, number>;
    constructor(actor: Select);
    private getActiveIndex(optionsMap?);
    fillOptionsMap(): void;
    ensureHighlightVisible(optionsMap?: Map<string, number>): void;
}
export declare class GenericBehavior extends Behavior implements IOptionsBehavior {
    actor: Select;
    constructor(actor: Select);
    first(): void;
    last(): void;
    prev(): void;
    next(): void;
    filter(query: RegExp): void;
}
export declare class ChildrenBehavior extends Behavior implements IOptionsBehavior {
    actor: Select;
    constructor(actor: Select);
    first(): void;
    last(): void;
    prev(): void;
    next(): void;
    filter(query: RegExp): void;
}
