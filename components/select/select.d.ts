import { EventEmitter, ElementRef, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SelectItem } from './select-item';
import { OptionsBehavior } from './select-interfaces';
export declare class SelectComponent implements OnInit {
    private sanitizer;
    allowClear: boolean;
    placeholder: string;
    idField: string;
    textField: string;
    multiple: boolean;
    items: Array<any>;
    disabled: boolean;
    active: Array<any>;
    data: EventEmitter<any>;
    selected: EventEmitter<any>;
    removed: EventEmitter<any>;
    typed: EventEmitter<any>;
    options: Array<SelectItem>;
    itemObjects: Array<SelectItem>;
    activeOption: SelectItem;
    element: ElementRef;
    private inputMode;
    private optionsOpened;
    private behavior;
    private inputValue;
    private _items;
    private _disabled;
    private _active;
    constructor(element: ElementRef, sanitizer: DomSanitizer);
    sanitize(html: string): SafeHtml;
    inputEvent(e: any, isUpMode?: boolean): void;
    ngOnInit(): any;
    remove(item: SelectItem): void;
    doEvent(type: string, value: any): void;
    clickedOutside(): void;
    readonly firstItemHasChildren: boolean;
    protected matchClick(e: any): void;
    protected mainClick(event: any): void;
    protected selectActive(value: SelectItem): void;
    protected isActive(value: SelectItem): boolean;
    private focusToInput(value?);
    private open();
    private hideOptions();
    private selectActiveMatch();
    private selectMatch(value, e?);
}
export declare class Behavior {
    optionsMap: Map<string, number>;
    actor: SelectComponent;
    constructor(actor: SelectComponent);
    fillOptionsMap(): void;
    ensureHighlightVisible(optionsMap?: Map<string, number>): void;
    private getActiveIndex(optionsMap?);
}
export declare class GenericBehavior extends Behavior implements OptionsBehavior {
    constructor(actor: SelectComponent);
    first(): void;
    last(): void;
    prev(): void;
    next(): void;
    filter(query: RegExp): void;
}
export declare class ChildrenBehavior extends Behavior implements OptionsBehavior {
    constructor(actor: SelectComponent);
    first(): void;
    last(): void;
    prev(): void;
    next(): void;
    filter(query: RegExp): void;
}
