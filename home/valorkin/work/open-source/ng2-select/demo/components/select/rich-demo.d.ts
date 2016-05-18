import { OnInit } from '@angular/core';
export declare class RichDemoComponent implements OnInit {
    private value;
    private _disabledV;
    private disabled;
    private items;
    ngOnInit(): any;
    private disabledV;
    selected(value: any): void;
    removed(value: any): void;
    typed(value: any): void;
    refreshValue(value: any): void;
}
